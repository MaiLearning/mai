use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::kv::KvRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::kv::KvEntryData;

pub struct SqliteKvRepository {
    pool: SqlitePool,
}

impl SqliteKvRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl KvRepository for SqliteKvRepository {
    async fn get(&self, key: &str) -> RepoResult<KvEntryData> {
        let row = sqlx::query_as::<_, KvEntryRow>(
            "SELECT key, value, created_at, updated_at FROM app_kv WHERE key = ?",
        )
        .bind(key)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("KV entry '{}' not found", key)))?;

        row.into_data()
    }

    async fn set(&self, data: KvEntryData) -> RepoResult<KvEntryData> {
        let value_str = serde_json::to_string(&data.value)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        sqlx::query(
            "INSERT INTO app_kv (key, value, created_at, updated_at)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET
                value = excluded.value,
                updated_at = excluded.updated_at",
        )
        .bind(&data.key)
        .bind(&value_str)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn delete(&self, key: &str) -> RepoResult<KvEntryData> {
        let data = self.get(key).await?;

        sqlx::query("DELETE FROM app_kv WHERE key = ?")
            .bind(key)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn exists(&self, key: &str) -> RepoResult<bool> {
        let row: Option<(i64,)> = sqlx::query_as("SELECT 1 FROM app_kv WHERE key = ? LIMIT 1")
            .bind(key)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(row.is_some())
    }

    async fn list_keys(&self, prefix: Option<&str>) -> RepoResult<Vec<String>> {
        let rows: Vec<(String,)> = match prefix {
            Some(p) => {
                let pattern = format!("{}%", escape_like(p));
                sqlx::query_as("SELECT key FROM app_kv WHERE key LIKE ? ESCAPE '\\' ORDER BY key")
                    .bind(pattern)
                    .fetch_all(&self.pool)
                    .await
                    .map_err(RepoError::Db)?
            }
            None => sqlx::query_as("SELECT key FROM app_kv ORDER BY key")
                .fetch_all(&self.pool)
                .await
                .map_err(RepoError::Db)?,
        };

        Ok(rows.into_iter().map(|(key,)| key).collect())
    }
}

/// Экранирование спецсимволов LIKE в префиксе.
fn escape_like(input: &str) -> String {
    input
        .replace('\\', "\\\\")
        .replace('%', "\\%")
        .replace('_', "\\_")
}

#[derive(sqlx::FromRow)]
struct KvEntryRow {
    key: String,
    value: String,
    created_at: i64,
    updated_at: i64,
}

impl KvEntryRow {
    fn into_data(self) -> RepoResult<KvEntryData> {
        let value: serde_json::Value = serde_json::from_str(&self.value)
            .map_err(|e| RepoError::Db(sqlx::Error::Configuration(e.into())))?;

        Ok(KvEntryData {
            key: self.key,
            value,
            created_at: self.created_at,
            updated_at: self.updated_at,
        })
    }
}
