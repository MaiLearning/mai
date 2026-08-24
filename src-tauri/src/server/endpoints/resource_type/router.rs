use crate::services::resource::ResourceServiceError;
use crate::utils::paths::AppPaths;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

pub fn router() -> axum::Router<(sqlx::SqlitePool, AppPaths)> {
    use axum::routing::get;
    axum::Router::new()
        .route("/", get(super::all::handler))
        .route("/{key}", get(super::get::handler))
        .route("/", axum::routing::post(super::create::handler))
        .route("/{key}", axum::routing::delete(super::delete::handler))
}

pub fn map_error(err: ResourceServiceError) -> impl IntoResponse {
    let (status, message) = match &err {
        ResourceServiceError::NotFound(msg) => (StatusCode::NOT_FOUND, msg.clone()),
        ResourceServiceError::AlreadyExists(msg) => (StatusCode::CONFLICT, msg.clone()),
        ResourceServiceError::Validation(msg) => (StatusCode::BAD_REQUEST, msg.clone()),
        ResourceServiceError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg.clone()),
    };
    (status, Json(serde_json::json!({"error": message}))).into_response()
}
