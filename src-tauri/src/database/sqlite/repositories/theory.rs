use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::theory::TheoryRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::theory::service::data::TheoryContentData;

pub struct SqliteTheoryRepository {
    pool: SqlitePool,
}

impl SqliteTheoryRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl TheoryRepository for SqliteTheoryRepository {
    async fn get(&self, resource_id: &str) -> RepoResult<TheoryContentData> {
        let row = sqlx::query_as::<_, TheoryContentRow>(
            "SELECT resource_id, content, created_at, updated_at
             FROM theory_content WHERE resource_id = ?",
        )
        .bind(resource_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| {
            RepoError::NotFound(format!(
                "Theory content for resource '{}' not found",
                resource_id
            ))
        })?;

        row.into_data()
    }

    async fn upsert(&self, data: TheoryContentData) -> RepoResult<TheoryContentData> {
        let content_str = serde_json::to_string(&data.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        sqlx::query(
            "INSERT INTO theory_content (resource_id, content, created_at, updated_at)
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

    async fn delete(&self, resource_id: &str) -> RepoResult<TheoryContentData> {
        let data = self.get(resource_id).await?;

        sqlx::query("DELETE FROM theory_content WHERE resource_id = ?")
            .bind(resource_id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

#[derive(sqlx::FromRow)]
struct TheoryContentRow {
    resource_id: String,
    content: String,
    created_at: i64,
    updated_at: i64,
}

impl TheoryContentRow {
    fn into_data(self) -> RepoResult<TheoryContentData> {
        let content: serde_json::Value = serde_json::from_str(&self.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(TheoryContentData {
            resource_id: self.resource_id,
            content,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
