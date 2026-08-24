use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::services::course::{CourseData, CourseService, CourseServiceError};
use crate::utils::paths::AppPaths;

#[utoipa::path(
    get,
    path = "/courses",
    tag = "courses",
    operation_id = "list_courses",
    responses(
        (status = 200, description = "List all courses", body = [CourseData])
    )
)]
pub async fn handler(
    State((pool, _app_paths)): State<(SqlitePool, AppPaths)>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteCourseRepository::new(pool));
    let service = CourseService::new(_app_paths, repo);

    match service.all().await {
        Ok(courses) => (StatusCode::OK, Json(serde_json::json!(courses))),
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
