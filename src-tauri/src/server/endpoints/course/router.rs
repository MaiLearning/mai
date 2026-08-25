use axum::{routing::delete, routing::get, routing::post, routing::put, Router};
use sqlx::SqlitePool;

use crate::utils::paths::AppPaths;

use super::{all, create, delete as delete_course, get, tags, update};

pub fn router() -> Router<(SqlitePool, AppPaths)> {
    Router::new()
        .route("/", get(all::handler))
        .route("/tags", get(tags::handler))
        .route("/{id}", get(get::handler))
        .route("/", post(create::handler))
        .route("/{id}", put(update::handler))
        .route("/{id}", delete(delete_course::handler))
}
