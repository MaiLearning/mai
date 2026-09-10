use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::code::CodeRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::code::service::data::CodeRowData;

pub struct SqliteCodeRepository {
    pool: SqlitePool,
}

impl SqliteCodeRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl CodeRepository for SqliteCodeRepository {
    async fn get(&self, resource_id: &str) -> RepoResult<CodeRowData> {
        let row = sqlx::query_as::<_, CodeRow>(
            "SELECT resource_id, content, created_at, updated_at
             FROM code WHERE resource_id = ?",
        )
        .bind(resource_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| {
            RepoError::NotFound(format!(
                "Code content for resource '{}' not found",
                resource_id
            ))
        })?;

        row.into_data()
    }

    async fn upsert(&self, data: CodeRowData) -> RepoResult<CodeRowData> {
        let content_str = serde_json::to_string(&data.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        sqlx::query(
            "INSERT INTO code (resource_id, content, created_at, updated_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(resource_id) DO UPDATE SET
                content = excluded.content,
                updated_at = excluded.updated_at",
        )
        .bind(&data.resource_id)
        .bind(&content_str)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn delete(&self, resource_id: &str) -> RepoResult<()> {
        sqlx::query("DELETE FROM code WHERE resource_id = ?")
            .bind(resource_id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(())
    }
}

#[derive(sqlx::FromRow)]
struct CodeRow {
    resource_id: String,
    content: String,
    created_at: i64,
    updated_at: i64,
}

impl CodeRow {
    fn into_data(self) -> RepoResult<CodeRowData> {
        let content: serde_json::Value = serde_json::from_str(&self.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(CodeRowData {
            resource_id: self.resource_id,
            content,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
