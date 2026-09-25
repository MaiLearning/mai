use sqlx::SqlitePool;

use super::migration::MigrationRunner;
use super::pool::create_pool;
use super::settings::DatabaseConfig;

pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new(config: DatabaseConfig) -> Self {
        let DatabaseConfig {
            path,
            max_connections,
        } = config;
        let migration_path = path.clone();
        tokio::task::spawn_blocking(move || {
            MigrationRunner::new().run(&migration_path);
        })
        .await
        .expect("migration task panicked");

        let pool = create_pool(&path, max_connections).await;

        Self { pool }
    }

    pub fn pool(&self) -> &SqlitePool {
        &self.pool
    }
}
