use axum::routing::patch;
use axum::Router;
use sqlx::SqlitePool;

use crate::utils::paths::AppPaths;

pub fn router() -> Router<(SqlitePool, AppPaths)> {
    Router::new().route("/{id}", patch(super::rename::handler))
}
