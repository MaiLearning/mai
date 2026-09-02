use axum::routing::patch;
use axum::Router;

use crate::server::state::AppState;

pub fn router() -> Router<AppState> {
    Router::new().route("/{id}", patch(super::rename::handler))
}
