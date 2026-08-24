// Создание пула соединений к SQLite.

use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::SqlitePool;
use std::str::FromStr;

use super::settings::DatabaseConfig;

// Создаёт пул соединений на основе конфигурации.
// SqliteConnectOptions — настройки соединения: путь, режимы, права.
// SqlitePoolOptions — настройки пула: лимит соединений.
pub async fn create_pool(config: &DatabaseConfig) -> SqlitePool {
    let connect_options = SqliteConnectOptions::from_str(&config.url)
        .expect("invalid database URL")
        .create_if_missing(true);

    SqlitePoolOptions::new()
        .max_connections(config.max_connections)
        .connect_with(connect_options)
        .await
        .expect("failed to create SQLite pool")
}
