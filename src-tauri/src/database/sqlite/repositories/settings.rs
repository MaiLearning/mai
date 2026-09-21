use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::settings::SettingsRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::settings::SettingsItemData;

pub struct SqliteSettingsRepository {
    pool: SqlitePool,
}

impl SqliteSettingsRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl SettingsRepository for SqliteSettingsRepository {
    async fn get(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData> {
        let row = sqlx::query_as::<_, SettingsItemRow>(
            "SELECT domain, item_id, payload, schema_version, created_at, updated_at
             FROM app_settings
             WHERE domain = ? AND item_id = ?",
        )
        .bind(domain)
        .bind(item_id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| {
            RepoError::NotFound(format!("Settings item '{}:{}' not found", domain, item_id))
        })?;

        row.into_data()
    }

    async fn set(&self, data: SettingsItemData) -> RepoResult<SettingsItemData> {
        let payload = serde_json::to_string(&data.settings)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        sqlx::query(
            "INSERT INTO app_settings (domain, item_id, payload, schema_version, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(domain, item_id) DO UPDATE SET
                payload = excluded.payload,
                schema_version = excluded.schema_version,
                updated_at = excluded.updated_at",
        )
        .bind(&data.domain)
        .bind(&data.item_id)
        .bind(&payload)
        .bind(data.schema_version)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn delete(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData> {
        let data = self.get(domain, item_id).await?;

        sqlx::query("DELETE FROM app_settings WHERE domain = ? AND item_id = ?")
            .bind(domain)
            .bind(item_id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

#[derive(sqlx::FromRow)]
struct SettingsItemRow {
    domain: String,
    item_id: String,
    payload: String,
    schema_version: i64,
    created_at: i64,
    updated_at: i64,
}

impl SettingsItemRow {
    fn into_data(self) -> RepoResult<SettingsItemData> {
        let settings: serde_json::Value = serde_json::from_str(&self.payload)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(SettingsItemData {
            domain: self.domain,
            item_id: self.item_id,
            settings,
            schema_version: self.schema_version,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
