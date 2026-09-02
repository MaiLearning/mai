use axum::{routing::delete, routing::get, routing::post, routing::put, Router};

use crate::server::state::AppState;

use super::{all, create, delete as delete_course, get, tags, update};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", get(all::handler))
        .route("/tags", get(tags::handler))
        .route("/{id}", get(get::handler))
        .route("/", post(create::handler))
        .route("/{id}", put(update::handler))
        .route("/{id}", delete(delete_course::handler))
}
