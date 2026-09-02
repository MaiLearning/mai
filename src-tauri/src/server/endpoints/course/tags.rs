use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::server::state::AppState;
use crate::services::course::{CourseService, CourseServiceError, CourseTagStat};

#[utoipa::path(
    get,
    path = "/courses/tags",
    tag = "courses",
    operation_id = "list_course_tags",
    responses(
        (status = 200, description = "List all tags with course counts", body = [CourseTagStat])
    )
)]
pub async fn handler(State(state): State<AppState>) -> impl IntoResponse {
    let repo = Arc::new(SqliteCourseRepository::new(state.pool));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());

    match service.all_tags().await {
        Ok(tags) => (StatusCode::OK, Json(serde_json::json!(tags))),
        Err(err) => map_error(err),
    }
}

fn map_error(err: CourseServiceError) -> (StatusCode, Json<serde_json::Value>) {
    let (status, message) = match err {
        CourseServiceError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
        CourseServiceError::Forbidden(msg) => (StatusCode::CONFLICT, msg),
        CourseServiceError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
        CourseServiceError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
    };
    (status, Json(serde_json::json!({"error": message})))
}
