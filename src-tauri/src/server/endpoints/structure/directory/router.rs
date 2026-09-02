use axum::routing::{delete, get, post};
use axum::Router;
use sqlx::SqlitePool;

use crate::utils::paths::AppPaths;

pub fn router() -> Router<(SqlitePool, AppPaths)> {
    Router::new()
        .route("/", post(super::create::handler))
        .route("/", get(super::list::handler))
        .route("/{id}", get(super::get::handler))
        .route("/{id}", delete(super::delete::handler))
}
