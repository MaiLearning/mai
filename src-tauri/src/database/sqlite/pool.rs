use std::path::Path;

use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::SqlitePool;

pub async fn create_pool(path: &Path, max_connections: u32) -> SqlitePool {
    let connect_options = SqliteConnectOptions::new()
        .filename(path)
        .create_if_missing(true);

    SqlitePoolOptions::new()
        .max_connections(max_connections)
        .connect_with(connect_options)
        .await
        .expect("failed to create SQLite pool")
}
