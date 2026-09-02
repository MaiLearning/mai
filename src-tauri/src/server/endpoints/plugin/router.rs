use crate::server::state::AppState;
use crate::services::plugin::PluginServiceError;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

pub fn router() -> axum::Router<AppState> {
    use axum::routing::get;
    axum::Router::new()
        .route("/", get(super::all::handler))
        .route("/{id}", get(super::get::handler))
        .route("/", axum::routing::post(super::register::handler))
        .route("/{id}", axum::routing::delete(super::remove::handler))
        .route(
            "/{id}/enabled",
            axum::routing::patch(super::set_enabled::handler),
        )
}

pub fn map_error(err: PluginServiceError) -> impl IntoResponse {
    let (status, message) = match &err {
        PluginServiceError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
        PluginServiceError::AlreadyExists(msg) => (StatusCode::CONFLICT, msg.clone()),
        PluginServiceError::Validation(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
        PluginServiceError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
    };
    (status, Json(serde_json::json!({"error": message}))).into_response()
}
