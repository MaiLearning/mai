use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::plugin::PluginRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::plugin::{PluginData, PluginKind};

pub struct SqlitePluginRepository {
    pool: SqlitePool,
}

impl SqlitePluginRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

const SELECT_WITH_KIND: &str = "\
    SELECT p.id, p.name, p.description, p.author, p.version, p.enabled, p.installed_at, p.updated_at, \
           'internal' as kind \
    FROM plugins p \
    INNER JOIN internal_plugins ip ON p.id = ip.plugin_id \
    UNION ALL \
    SELECT p.id, p.name, p.description, p.author, p.version, p.enabled, p.installed_at, p.updated_at, \
           'external' as kind \
    FROM plugins p \
    INNER JOIN external_plugins ep ON p.id = ep.plugin_id";

#[async_trait]
impl PluginRepository for SqlitePluginRepository {
    async fn all(&self) -> RepoResult<Vec<PluginData>> {
        let rows = sqlx::query_as::<_, PluginRow>(&format!("{} ORDER BY name", SELECT_WITH_KIND))
            .fetch_all(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.into()).collect())
    }

    async fn get(&self, id: &str) -> RepoResult<PluginData> {
        let row = sqlx::query_as::<_, PluginRow>(&format!("{} WHERE p.id = ?", SELECT_WITH_KIND))
            .bind(id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?
            .ok_or_else(|| RepoError::NotFound(format!("Plugin '{}' not found", id)))?;

        Ok(row.into())
    }

    async fn create_external(&self, data: PluginData, sdk_version: &str) -> RepoResult<PluginData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let result = sqlx::query(
            "INSERT INTO plugins (id, name, description, author, version, enabled, installed_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.author)
        .bind(&data.version)
        .bind(data.enabled)
        .bind(data.installed_at)
        .bind(data.updated_at)
        .execute(&mut *tx)
        .await;

        match result {
            Ok(_) => {}
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
                return Err(RepoError::Conflict(format!(
                    "Plugin with id '{}' already exists",
                    data.id
                )));
            }
            Err(e) => return Err(RepoError::Db(e)),
        }

        sqlx::query("INSERT INTO external_plugins (plugin_id, sdk_version) VALUES (?, ?)")
            .bind(&data.id)
            .bind(sdk_version)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        tx.commit().await.map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn create_internal(&self, data: PluginData) -> RepoResult<PluginData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let result = sqlx::query(
            "INSERT INTO plugins (id, name, description, author, version, enabled, installed_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.author)
        .bind(&data.version)
        .bind(data.enabled)
        .bind(data.installed_at)
        .bind(data.updated_at)
        .execute(&mut *tx)
        .await;

        match result {
            Ok(_) => {}
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
                return Err(RepoError::Conflict(format!(
                    "Plugin with id '{}' already exists",
                    data.id
                )));
            }
            Err(e) => return Err(RepoError::Db(e)),
        }

        sqlx::query("INSERT INTO internal_plugins (plugin_id) VALUES (?)")
            .bind(&data.id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        tx.commit().await.map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn delete(&self, id: &str) -> RepoResult<PluginData> {
        let data = self.get(id).await?;

        sqlx::query("DELETE FROM plugins WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn set_enabled(&self, id: &str, enabled: bool) -> RepoResult<()> {
        let now = now_millis();
        let result = sqlx::query("UPDATE plugins SET enabled = ?, updated_at = ? WHERE id = ?")
            .bind(enabled)
            .bind(now)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!("Plugin '{}' not found", id)));
        }

        Ok(())
    }
}

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64
}

#[derive(sqlx::FromRow)]
struct PluginRow {
    id: String,
    name: String,
    description: Option<String>,
    author: Option<String>,
    version: String,
    enabled: bool,
    installed_at: i64,
    updated_at: i64,
    kind: String,
}

impl From<PluginRow> for PluginData {
    fn from(r: PluginRow) -> Self {
        PluginData {
            id: r.id,
            name: r.name,
            description: r.description,
            author: r.author,
            version: r.version,
            enabled: r.enabled,
            kind: match r.kind.as_str() {
                "internal" => PluginKind::Internal,
                _ => PluginKind::External,
            },
            installed_at: r.installed_at,
            updated_at: r.updated_at,
        }
    }
}
