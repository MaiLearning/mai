use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::resource_type::ResourceTypeRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::resource::ResourceTypeData;

pub struct SqliteResourceTypeRepository {
    pool: SqlitePool,
}

impl SqliteResourceTypeRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl ResourceTypeRepository for SqliteResourceTypeRepository {
    async fn all(&self) -> RepoResult<Vec<ResourceTypeData>> {
        let rows = sqlx::query_as::<_, ResourceTypeRow>(
            "SELECT key, name, description, plugin_id, supported_extensions, created_at, updated_at
             FROM resource_types ORDER BY key",
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

    async fn get(&self, key: &str) -> RepoResult<ResourceTypeData> {
        let row = sqlx::query_as::<_, ResourceTypeRow>(
            "SELECT key, name, description, plugin_id, supported_extensions, created_at, updated_at
             FROM resource_types WHERE key = ?",
        )
        .bind(key)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("Resource type '{}' not found", key)))?;

        row.into_data()
    }

    async fn create(&self, data: ResourceTypeData) -> RepoResult<ResourceTypeData> {
        let extensions_str = serde_json::to_string(&data.supported_extensions)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        let result = sqlx::query(
            "INSERT INTO resource_types (key, name, description, plugin_id, supported_extensions, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.key)
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.plugin_id)
        .bind(&extensions_str)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await;

        match result {
            Ok(_) => Ok(data),
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => Err(
                RepoError::Conflict(format!("Resource type '{}' already exists", data.key)),
            ),
            Err(e) => Err(RepoError::Db(e)),
        }
    }

    async fn update(&self, data: ResourceTypeData) -> RepoResult<ResourceTypeData> {
        let extensions_str = serde_json::to_string(&data.supported_extensions)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        let result = sqlx::query(
            "UPDATE resource_types SET name = ?, description = ?, plugin_id = ?,
             supported_extensions = ?, updated_at = ? WHERE key = ?",
        )
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.plugin_id)
        .bind(&extensions_str)
        .bind(data.updated_at)
        .bind(&data.key)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Resource type '{}' not found",
                data.key
            )));
        }

        Ok(data)
    }

    async fn delete(&self, key: &str) -> RepoResult<ResourceTypeData> {
        let data = self.get(key).await?;

        sqlx::query("DELETE FROM resource_types WHERE key = ?")
            .bind(key)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

#[derive(sqlx::FromRow)]
struct ResourceTypeRow {
    key: String,
    name: String,
    description: Option<String>,
    plugin_id: Option<String>,
    supported_extensions: String,
    created_at: i64,
    updated_at: i64,
}

impl ResourceTypeRow {
    fn into_data(self) -> RepoResult<ResourceTypeData> {
        let supported_extensions: Vec<String> = serde_json::from_str(&self.supported_extensions)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(ResourceTypeData {
            key: self.key,
            name: self.name,
            description: self.description,
            plugin_id: self.plugin_id,
            supported_extensions,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
