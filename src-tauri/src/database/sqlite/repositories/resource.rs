use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::resource::ResourceData;

pub struct SqliteResourceRepository {
    pool: SqlitePool,
}

impl SqliteResourceRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ResourceRepository for SqliteResourceRepository {
    async fn all(&self) -> RepoResult<Vec<ResourceData>> {
        let rows = sqlx::query_as::<_, ResourceRow>(
            "SELECT id, course_id, type_key, name, metadata, files, created_at, updated_at
             FROM resources ORDER BY name",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        let mut result = Vec::with_capacity(rows.len());
        for row in rows {
            result.push(row.into_data()?);
        }
        Ok(result)
    }

    async fn get(&self, id: &str) -> RepoResult<ResourceData> {
        let row = sqlx::query_as::<_, ResourceRow>(
            "SELECT id, course_id, type_key, name, metadata, files, created_at, updated_at
             FROM resources WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("Resource '{}' not found", id)))?;

        row.into_data()
    }

    async fn create(&self, data: ResourceData) -> RepoResult<ResourceData> {
        let metadata_str = serde_json::to_string(&data.metadata)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;
        let files_str = serde_json::to_string(&data.files)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        let result = sqlx::query(
            "INSERT INTO resources (id, course_id, type_key, name, metadata, files, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.course_id)
        .bind(&data.type_key)
        .bind(&data.name)
        .bind(&metadata_str)
        .bind(&files_str)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await;

        match result {
            Ok(_) => Ok(data),
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => Err(
                RepoError::Conflict(format!("Resource with id '{}' already exists", data.id)),
            ),
            Err(e) => Err(RepoError::Db(e)),
        }
    }

    async fn update(&self, data: ResourceData) -> RepoResult<ResourceData> {
        let metadata_str = serde_json::to_string(&data.metadata)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;
        let files_str = serde_json::to_string(&data.files)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        let result = sqlx::query(
            "UPDATE resources SET type_key = ?, name = ?, metadata = ?, files = ?,
             created_at = ?, updated_at = ? WHERE id = ?",
        )
        .bind(&data.type_key)
        .bind(&data.name)
        .bind(&metadata_str)
        .bind(&files_str)
        .bind(data.created_at)
        .bind(data.updated_at)
        .bind(&data.id)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Resource '{}' not found",
                data.id
            )));
        }

        Ok(data)
    }

    async fn delete(&self, id: &str) -> RepoResult<ResourceData> {
        let data = self.get(id).await?;

        sqlx::query("DELETE FROM resources WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

#[derive(sqlx::FromRow)]
struct ResourceRow {
    id: String,
    course_id: String,
    type_key: Option<String>,
    name: String,
    metadata: String,
    files: String,
    created_at: i64,
    updated_at: i64,
}

impl ResourceRow {
    fn into_data(self) -> RepoResult<ResourceData> {
        let metadata: serde_json::Value = serde_json::from_str(&self.metadata)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;
        let files: Vec<String> = serde_json::from_str(&self.files)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(ResourceData {
            id: self.id,
            course_id: self.course_id,
            type_key: self.type_key,
            name: self.name,
            metadata,
            files,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
