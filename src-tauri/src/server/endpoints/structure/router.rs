use axum::routing::{get, patch};
use axum::Router;
use axum::{http::StatusCode, Json};

use crate::server::state::AppState;
use crate::services::structure::StructureServiceError;

use super::directory::router as directory_router;
use super::node::router as node_router;
use super::{get_by_course, get_by_resource, move_node};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/by-course/{course_id}", get(get_by_course::handler))
        .route("/by-resource/{resource_id}", get(get_by_resource::handler))
        .route("/{node_id}/move", patch(move_node::handler))
        .nest("/directory", directory_router::router())
        .nest("/node", node_router::router())
}

pub fn map_error(err: StructureServiceError) -> (StatusCode, Json<serde_json::Value>) {
    let (status, message) = match err {
        StructureServiceError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
        StructureServiceError::Forbidden(msg) => (StatusCode::CONFLICT, msg),
        StructureServiceError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
        StructureServiceError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
    };
    (status, Json(serde_json::json!({"error": message})))
}
