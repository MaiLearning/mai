use sqlx::SqlitePool;

use super::migration::MigrationRunner;
use super::pool::create_pool;
use super::settings::DatabaseConfig;

pub struct Database {
    pub pool: SqlitePool,
}

impl Database {
    pub async fn new(config: DatabaseConfig) -> Self {
        let url = config.url.clone();
        tokio::task::spawn_blocking(move || {
            MigrationRunner::new().run(&url);
        })
        .await
        .expect("migration task panicked");

        let pool = create_pool(&config).await;

        Self { pool }
    }

    pub fn pool(&self) -> &SqlitePool {
        &self.pool
    }
}
