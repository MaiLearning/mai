use axum::routing::{delete, get, post};
use axum::Router;

use crate::server::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", post(super::create::handler))
        .route("/", get(super::list::handler))
        .route("/{id}", get(super::get::handler))
        .route("/{id}", delete(super::delete::handler))
}
