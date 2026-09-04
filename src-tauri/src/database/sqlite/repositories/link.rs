//! SQL-реализация хранилища link-плагина: рёбра графа связей.
//! Изменяемые поля — только title/description/target/updated_at;
//! Row-структуры и сборка wire-моделей — в rows.rs, тесты — в tests.rs.

mod rows;
#[cfg(test)]
mod tests;

use async_trait::async_trait;
use sqlx::SqlitePool;

use self::rows::{rows_to_data, target_columns, LinkRow, LINK_COLUMNS};
use crate::database::repository::link::LinkRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::link::service::data::{LinkData, LinkSourceRef, LinkTargetData};

pub struct SqliteLinkRepository {
    pool: SqlitePool,
}

impl SqliteLinkRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl LinkRepository for SqliteLinkRepository {
    async fn insert(&self, data: LinkData) -> RepoResult<()> {
        let (kind, course_id, resource_id, uri) = target_columns(&data.target);
        let result = sqlx::query(
            "INSERT INTO links (id, source_type, source_id, target_kind, target_course_id, \
             target_resource_id, target_uri, owner_plugin_id, title, description, created_at, updated_at) \
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.source_type)
        .bind(&data.source_id)
        .bind(kind)
        .bind(course_id)
        .bind(resource_id)
        .bind(uri)
        .bind(&data.owner_plugin_id)
        .bind(&data.title)
        .bind(&data.description)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await;

        match result {
            Ok(_) => Ok(()),
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => Err(
                RepoError::Conflict(format!("Link '{}' already exists", data.id)),
            ),
            Err(e) => Err(RepoError::Db(e)),
        }
    }

    async fn get(&self, id: &str) -> RepoResult<LinkData> {
        let sql = format!("SELECT {} FROM links WHERE id = ?", LINK_COLUMNS);
        let row = sqlx::query_as::<_, LinkRow>(&sql)
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| RepoError::NotFound(format!("Link '{}' not found", id)))?;

        row.into_data()
    }

    async fn update(&self, data: LinkData) -> RepoResult<()> {
        let (kind, course_id, resource_id, uri) = target_columns(&data.target);
        let result = sqlx::query(
            "UPDATE links SET title = ?, description = ?, target_kind = ?, target_course_id = ?, \
             target_resource_id = ?, target_uri = ?, updated_at = ? WHERE id = ?",
        )
        .bind(&data.title)
        .bind(&data.description)
        .bind(kind)
        .bind(course_id)
        .bind(resource_id)
        .bind(uri)
        .bind(data.updated_at)
        .bind(&data.id)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!("Link '{}' not found", data.id)));
        }
        Ok(())
    }

    async fn delete(&self, id: &str) -> RepoResult<()> {
        sqlx::query("DELETE FROM links WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;
        Ok(())
    }

    async fn delete_by_ids(&self, ids: &[String]) -> RepoResult<u64> {
        if ids.is_empty() {
            return Ok(0);
        }

        let placeholders = vec!["?"; ids.len()].join(", ");
        let sql = format!("DELETE FROM links WHERE id IN ({})", placeholders);
        let mut query = sqlx::query(&sql);
        for id in ids {
            query = query.bind(id);
        }
        let result = query.execute(&self.pool).await.map_err(RepoError::Db)?;
        Ok(result.rows_affected())
    }

    async fn list_by_source(
        &self,
        source_type: &str,
        source_id: &str,
    ) -> RepoResult<Vec<LinkData>> {
        let sql = format!(
            "SELECT {} FROM links WHERE source_type = ? AND source_id = ? ORDER BY created_at",
            LINK_COLUMNS
        );
        let rows = sqlx::query_as::<_, LinkRow>(&sql)
            .bind(source_type)
            .bind(source_id)
            .fetch_all(&self.pool)
            .await
            .map_err(RepoError::Db)?;
        rows_to_data(rows)
    }

    async fn list_by_target(&self, target: &LinkTargetData) -> RepoResult<Vec<LinkData>> {
        // Каждый вид цели бьёт в свой частичный индекс.
        let (filter_column, value) = match target {
            LinkTargetData::Resource { resource_id, .. } => ("target_resource_id", resource_id),
            LinkTargetData::Course { course_id } => ("target_course_id", course_id),
            LinkTargetData::Uri { uri } => ("target_uri", uri),
        };
        let sql = format!(
            "SELECT {} FROM links WHERE target_kind = '{}' AND {} = ? ORDER BY created_at",
            LINK_COLUMNS,
            target.kind_name(),
            filter_column
        );

        let rows = sqlx::query_as::<_, LinkRow>(&sql)
            .bind(value)
            .fetch_all(&self.pool)
            .await
            .map_err(RepoError::Db)?;
        rows_to_data(rows)
    }

    async fn list_by_course(&self, course_id: &str) -> RepoResult<Vec<LinkData>> {
        // Рёбра курса: источник — сам курс или ресурс этого курса.
        // FromRow собирает модель по именам колонок, поэтому l.* достаточен.
        let sql = "SELECT l.* FROM links l \
                   LEFT JOIN resources r ON l.source_type = 'resource' AND r.id = l.source_id \
                   WHERE (l.source_type = 'course' AND l.source_id = ?) \
                      OR (l.source_type = 'resource' AND r.course_id = ?) \
                   ORDER BY l.created_at";
        let rows = sqlx::query_as::<_, LinkRow>(sql)
            .bind(course_id)
            .bind(course_id)
            .fetch_all(&self.pool)
            .await
            .map_err(RepoError::Db)?;
        rows_to_data(rows)
    }

    async fn list_source_refs(&self) -> RepoResult<Vec<LinkSourceRef>> {
        let rows: Vec<(String, String)> = sqlx::query_as(
            "SELECT DISTINCT source_type, source_id FROM links \
                            ORDER BY source_type, source_id",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(rows
            .into_iter()
            .map(|(source_type, source_id)| LinkSourceRef {
                source_type,
                source_id,
            })
            .collect())
    }
}
