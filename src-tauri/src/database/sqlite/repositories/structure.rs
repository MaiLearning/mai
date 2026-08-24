use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::structure::StructureRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::resource::ResourceData;
use crate::services::structure::StructureNodeFlat;

pub struct SqliteStructureRepository {
    pool: SqlitePool,
}

impl SqliteStructureRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl StructureRepository for SqliteStructureRepository {
    async fn get_structure(&self, course_id: &str) -> RepoResult<Vec<StructureNodeFlat>> {
        let rows = sqlx::query_as::<_, StructureRow>(STRUCTURE_QUERY)
            .bind(course_id)
            .fetch_all(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.into()).collect())
    }

    async fn get_structure_node_by_resource(
        &self,
        resource_id: &str,
    ) -> RepoResult<StructureNodeFlat> {
        let row = sqlx::query_as::<_, StructureRow>(STRUCTURE_QUERY_RESOURCE)
            .bind(resource_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| {
                RepoError::NotFound(format!("Node for resource '{}' not found", resource_id))
            })?;

        Ok(row.into())
    }

    async fn get_node(&self, node_id: &str) -> RepoResult<StructureNodeFlat> {
        let row = sqlx::query_as::<_, StructureRow>(STRUCTURE_QUERY_NODE)
            .bind(node_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| RepoError::NotFound(format!("Node '{}' not found", node_id)))?;

        Ok(row.into())
    }

    async fn create_node(
        &self,
        id: &str,
        course_id: &str,
        parent_id: Option<&str>,
        _position: i64,
        resource_id: Option<&str>,
        directory_id: Option<&str>,
    ) -> RepoResult<StructureNodeFlat> {
        sqlx::query(
            "INSERT INTO structures (id, course_id, parent_id, resource_id, directory_id, position) \
             VALUES (?, ?, ?, ?, ?, \
                 (SELECT COALESCE(MAX(position), -1) + 1 \
                  FROM structures \
                  WHERE course_id = ? \
                  AND ((? IS NULL AND parent_id IS NULL) OR parent_id = ?)))",
        )
        .bind(id)
        .bind(course_id)
        .bind(parent_id)
        .bind(resource_id)
        .bind(directory_id)
        .bind(course_id)
        .bind(parent_id)
        .bind(parent_id)
        .execute(&self.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::Database(db_err) if db_err.is_unique_violation() => {
                RepoError::Conflict(format!("Node already exists under this parent at this position"))
            }
            other => RepoError::Db(other),
        })?;

        self.get_node(id).await
    }

    async fn delete_node(&self, node_id: &str) -> RepoResult<()> {
        let result = sqlx::query("DELETE FROM structures WHERE id = ?")
            .bind(node_id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!("Node '{}' not found", node_id)));
        }

        Ok(())
    }

    async fn get_node_directory_id(&self, node_id: &str) -> RepoResult<Option<String>> {
        let row =
            sqlx::query_as::<_, DirectoryIdRow>("SELECT directory_id FROM structures WHERE id = ?")
                .bind(node_id)
                .fetch_optional(&self.pool)
                .await
                .map_err(RepoError::Db)?
                .ok_or_else(|| RepoError::NotFound(format!("Node '{}' not found", node_id)))?;

        Ok(row.directory_id)
    }

    async fn move_node(
        &self,
        node_id: &str,
        new_parent_id: Option<&str>,
        position: i64,
    ) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        // 1. Read current state of the node being moved
        let (course_id, old_parent_id, old_position) =
            sqlx::query_as::<_, (String, Option<String>, i64)>(
                "SELECT course_id, parent_id, position FROM structures WHERE id = ?",
            )
            .bind(node_id)
            .fetch_optional(&mut *tx)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| RepoError::NotFound(format!("Node '{}' not found", node_id)))?;

        // 2. Early return if no actual change
        if old_parent_id.as_deref() == new_parent_id && old_position == position {
            return Ok(());
        }

        // Helper: parent condition — works for both root (parent_id IS NULL) and child nodes
        fn parent_condition() -> &'static str {
            "((? IS NULL AND parent_id IS NULL) OR parent_id = ?)"
        }

        // Two-phase shift offset: temporary values are guaranteed unique
        // and outside the valid position range.
        const SHIFT_OFFSET: i64 = 10_000_000;

        // 3. Phase A: Remove from old position
        //    a. Temporarily move node to position -1 (outside valid range)
        sqlx::query("UPDATE structures SET position = -1 WHERE id = ?")
            .bind(node_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        //    b. Close gap: decrement siblings above the moved node
        //       Two-phase approach to avoid UNIQUE constraint violations
        //       (same reason as Phase B — SQLite immediate mode)
        //
        //       Phase 1: shift > old_position to unique temporary negative values
        sqlx::query(&format!(
            "UPDATE structures SET position = -position - ? \
                 WHERE course_id = ? AND position > ? AND id != ? AND {}",
            parent_condition()
        ))
        .bind(SHIFT_OFFSET)
        .bind(&course_id)
        .bind(old_position)
        .bind(node_id)
        .bind(old_parent_id.as_deref())
        .bind(old_parent_id.as_deref())
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        //       Phase 2: restore to decremented positive values (position - 1)
        sqlx::query(&format!(
            "UPDATE structures SET position = -position - ? - 1 \
                 WHERE course_id = ? AND position < 0 AND id != ? AND {}",
            parent_condition()
        ))
        .bind(SHIFT_OFFSET)
        .bind(&course_id)
        .bind(node_id)
        .bind(old_parent_id.as_deref())
        .bind(old_parent_id.as_deref())
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        // 4. Phase B: Insert at new position
        //       Two-phase approach to avoid UNIQUE constraint violations
        //
        //       Phase 1: shift >= target position to unique temporary negative values
        sqlx::query(&format!(
            "UPDATE structures SET position = -position - ? \
                 WHERE course_id = ? AND position >= ? AND id != ? AND {}",
            parent_condition()
        ))
        .bind(SHIFT_OFFSET)
        .bind(&course_id)
        .bind(position)
        .bind(node_id)
        .bind(new_parent_id)
        .bind(new_parent_id)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        //       Phase 2: restore to correct shifted positive values (position + 1)
        sqlx::query(&format!(
            "UPDATE structures SET position = -position - ? + 1 \
                 WHERE course_id = ? AND position < 0 AND id != ? AND {}",
            parent_condition()
        ))
        .bind(SHIFT_OFFSET)
        .bind(&course_id)
        .bind(node_id)
        .bind(new_parent_id)
        .bind(new_parent_id)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        //    b. Place the moved node at its final position
        let result = sqlx::query("UPDATE structures SET parent_id = ?, position = ? WHERE id = ?")
            .bind(new_parent_id)
            .bind(position)
            .bind(node_id)
            .execute(&mut *tx)
            .await;

        match result {
            Ok(r) => {
                if r.rows_affected() == 0 {
                    return Err(RepoError::NotFound(format!("Node '{}' not found", node_id)));
                }
            }
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
                return Err(RepoError::Conflict(format!(
                    "Position {} is already taken under the specified parent",
                    position
                )));
            }
            Err(e) => return Err(RepoError::Db(e)),
        }

        tx.commit().await.map_err(RepoError::Db)?;
        Ok(())
    }

    async fn get_subtree_ids(&self, node_id: &str) -> RepoResult<Vec<String>> {
        let rows: Vec<(String,)> = sqlx::query_as(
            "WITH RECURSIVE descendants(id) AS (
                SELECT id FROM structures WHERE id = ?
                UNION ALL
                SELECT s.id FROM structures s JOIN descendants d ON s.parent_id = d.id
            )
            SELECT id FROM descendants",
        )
        .bind(node_id)
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.0).collect())
    }

    async fn get_resource_ids(&self, node_ids: &[String]) -> RepoResult<Vec<String>> {
        if node_ids.is_empty() {
            return Ok(vec![]);
        }
        let placeholders: Vec<&str> = node_ids.iter().map(|_| "?").collect();
        let sql = format!(
            "SELECT resource_id FROM structures WHERE id IN ({}) AND resource_id IS NOT NULL",
            placeholders.join(", ")
        );
        let mut query = sqlx::query_as::<_, (String,)>(&sql);
        for id in node_ids {
            query = query.bind(id);
        }
        let rows: Vec<(String,)> = query.fetch_all(&self.pool).await.map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.0).collect())
    }

    async fn get_directory_ids(&self, node_ids: &[String]) -> RepoResult<Vec<String>> {
        if node_ids.is_empty() {
            return Ok(vec![]);
        }
        let placeholders: Vec<&str> = node_ids.iter().map(|_| "?").collect();
        let sql = format!(
            "SELECT directory_id FROM structures WHERE id IN ({}) AND directory_id IS NOT NULL",
            placeholders.join(", ")
        );
        let mut query = sqlx::query_as::<_, (String,)>(&sql);
        for id in node_ids {
            query = query.bind(id);
        }
        let rows: Vec<(String,)> = query.fetch_all(&self.pool).await.map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.0).collect())
    }

    async fn would_create_cycle(&self, node_id: &str, parent_id: &str) -> RepoResult<bool> {
        let row: Option<(i64,)> = sqlx::query_as(
            "WITH RECURSIVE ancestors(x) AS (
                SELECT parent_id FROM structures WHERE id = ?
                UNION ALL
                SELECT s.parent_id FROM structures s JOIN ancestors a ON s.id = a.x
                WHERE a.x IS NOT NULL
            )
            SELECT 1 FROM ancestors WHERE x = ?",
        )
        .bind(parent_id)
        .bind(node_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(row.is_some())
    }

    async fn get_node_course_id(&self, node_id: &str) -> RepoResult<String> {
        let row: (String,) = sqlx::query_as("SELECT course_id FROM structures WHERE id = ?")
            .bind(node_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| RepoError::NotFound(format!("Node '{}' not found", node_id)))?;

        Ok(row.0)
    }
}

// ---------------------------------------------------------------------------
// SQL queries
// ---------------------------------------------------------------------------

const STRUCTURE_QUERY: &str = "SELECT s.id, s.course_id, s.parent_id, s.position, \
     CASE WHEN s.directory_id IS NOT NULL THEN 1 ELSE 0 END AS is_directory, \
     s.resource_id, s.directory_id, \
     r.type_key, r.name AS resource_name, r.course_id AS resource_course_id, \
     r.created_at AS resource_created_at, r.updated_at AS resource_updated_at, \
     d.name AS directory_name, \
     COALESCE(r.name, d.name) AS node_name \
     FROM structures s \
     LEFT JOIN resources r ON r.id = s.resource_id \
     LEFT JOIN directories d ON d.id = s.directory_id \
     WHERE s.course_id = ? \
     ORDER BY s.parent_id, s.position";

const STRUCTURE_QUERY_RESOURCE: &str = "SELECT s.id, s.course_id, s.parent_id, s.position, \
     CASE WHEN s.directory_id IS NOT NULL THEN 1 ELSE 0 END AS is_directory, \
     s.resource_id, s.directory_id, \
     r.type_key, r.name AS resource_name, r.course_id AS resource_course_id, \
     r.created_at AS resource_created_at, r.updated_at AS resource_updated_at, \
     d.name AS directory_name, \
     COALESCE(r.name, d.name) AS node_name \
     FROM structures s \
     LEFT JOIN resources r ON r.id = s.resource_id \
     LEFT JOIN directories d ON d.id = s.directory_id \
     WHERE s.resource_id = ?";

const STRUCTURE_QUERY_NODE: &str = "SELECT s.id, s.course_id, s.parent_id, s.position, \
     CASE WHEN s.directory_id IS NOT NULL THEN 1 ELSE 0 END AS is_directory, \
     s.resource_id, s.directory_id, \
     r.type_key, r.name AS resource_name, r.course_id AS resource_course_id, \
     r.created_at AS resource_created_at, r.updated_at AS resource_updated_at, \
     d.name AS directory_name, \
     COALESCE(r.name, d.name) AS node_name \
     FROM structures s \
     LEFT JOIN resources r ON r.id = s.resource_id \
     LEFT JOIN directories d ON d.id = s.directory_id \
     WHERE s.id = ?";

// ---------------------------------------------------------------------------
// Row types
// ---------------------------------------------------------------------------

#[derive(sqlx::FromRow)]
struct StructureRow {
    id: String,
    course_id: String,
    parent_id: Option<String>,
    position: i64,
    is_directory: i64,
    resource_id: Option<String>,
    type_key: Option<String>,
    resource_name: Option<String>,
    resource_course_id: Option<String>,
    resource_created_at: Option<i64>,
    resource_updated_at: Option<i64>,
    directory_id: Option<String>,
    // directory_name: Option<String>,
    node_name: String,
}

#[derive(sqlx::FromRow)]
struct DirectoryIdRow {
    directory_id: Option<String>,
}

impl From<StructureRow> for StructureNodeFlat {
    fn from(r: StructureRow) -> Self {
        let is_directory = r.is_directory != 0;

        let resource = if is_directory {
            None
        } else {
            Some(ResourceData {
                id: r.resource_id.unwrap_or_default(),
                course_id: r.resource_course_id.unwrap_or_default(),
                type_key: r.type_key,
                name: r.resource_name.unwrap_or_default(),
                metadata: serde_json::json!({}),
                files: vec![],
                created_at: r.resource_created_at.unwrap_or(0),
                updated_at: r.resource_updated_at.unwrap_or(0),
            })
        };

        StructureNodeFlat {
            id: r.id,
            course_id: r.course_id,
            parent_id: r.parent_id,
            position: r.position,
            is_directory,
            resource,
            directory_id: r.directory_id,
            name: r.node_name,
        }
    }
}
