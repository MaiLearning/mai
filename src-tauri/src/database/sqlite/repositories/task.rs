use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::task::TaskRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::task::service::data::TaskContentData;

pub struct SqliteTaskRepository {
    pool: SqlitePool,
}

impl SqliteTaskRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl TaskRepository for SqliteTaskRepository {
    async fn get(&self, resource_id: &str) -> RepoResult<TaskContentData> {
        let row = sqlx::query_as::<_, TaskContentRow>(
            "SELECT resource_id, content, created_at, updated_at
             FROM task WHERE resource_id = ?",
        )
        .bind(resource_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| {
            RepoError::NotFound(format!(
                "Task content for resource '{}' not found",
                resource_id
            ))
        })?;

        row.into_data()
    }

    async fn upsert(&self, data: TaskContentData) -> RepoResult<TaskContentData> {
        let content_str = serde_json::to_string(&data.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        sqlx::query(
            "INSERT INTO task (resource_id, content, created_at, updated_at)
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

    async fn delete(&self, resource_id: &str) -> RepoResult<TaskContentData> {
        let data = self.get(resource_id).await?;

        sqlx::query("DELETE FROM task WHERE resource_id = ?")
            .bind(resource_id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

#[derive(sqlx::FromRow)]
struct TaskContentRow {
    resource_id: String,
    content: String,
    created_at: i64,
    updated_at: i64,
}

impl TaskContentRow {
    fn into_data(self) -> RepoResult<TaskContentData> {
        let content: serde_json::Value = serde_json::from_str(&self.content)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(TaskContentData {
            resource_id: self.resource_id,
            content,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
