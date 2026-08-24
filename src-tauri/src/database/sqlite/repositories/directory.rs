use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::directory::DirectoryRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::structure::DirectoryData;

pub struct SqliteDirectoryRepository {
    pool: SqlitePool,
}

impl SqliteDirectoryRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl DirectoryRepository for SqliteDirectoryRepository {
    async fn create(&self, id: &str, course_id: &str, name: &str) -> RepoResult<()> {
        sqlx::query("INSERT INTO directories (id, course_id, name) VALUES (?, ?, ?)")
            .bind(id)
            .bind(course_id)
            .bind(name)
            .execute(&self.pool)
            .await
            .map_err(|e| match e {
                sqlx::Error::Database(db_err) if db_err.is_unique_violation() => {
                    RepoError::Conflict(format!("Directory '{}' already exists", id))
                }
                other => RepoError::Db(other),
            })?;

        Ok(())
    }

    async fn get(&self, id: &str) -> RepoResult<DirectoryData> {
        let row = sqlx::query_as::<_, DirectoryRow>(
            "SELECT id, course_id, name, created_at, updated_at FROM directories WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("Directory '{}' not found", id)))?;

        Ok(row.into())
    }

    async fn get_by_course(&self, course_id: &str) -> RepoResult<Vec<DirectoryData>> {
        let rows = sqlx::query_as::<_, DirectoryRow>(
            "SELECT id, course_id, name, created_at, updated_at FROM directories WHERE course_id = ? ORDER BY name",
        )
        .bind(course_id)
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.into()).collect())
    }

    async fn update_name(&self, id: &str, name: &str) -> RepoResult<()> {
        let result = sqlx::query("UPDATE directories SET name = ? WHERE id = ?")
            .bind(name)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!("Directory '{}' not found", id)));
        }

        Ok(())
    }

    async fn delete(&self, id: &str) -> RepoResult<()> {
        let result = sqlx::query("DELETE FROM directories WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!("Directory '{}' not found", id)));
        }

        Ok(())
    }
}

#[derive(sqlx::FromRow)]
struct DirectoryRow {
    id: String,
    course_id: String,
    name: String,
    created_at: i64,
    updated_at: i64,
}

impl From<DirectoryRow> for DirectoryData {
    fn from(r: DirectoryRow) -> Self {
        DirectoryData {
            id: r.id,
            course_id: r.course_id,
            name: r.name,
            created_at: r.created_at,
            updated_at: r.updated_at,
        }
    }
}
