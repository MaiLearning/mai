use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::services::course::{CourseData, CourseService, CourseServiceError};
use crate::utils::paths::AppPaths;

#[utoipa::path(
    delete,
    path = "/courses/{id}",
    tag = "courses",
    operation_id = "delete_course",
    responses(
        (status = 200, description = "Course deleted", body = CourseData),
        (status = 404, description = "Course not found")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteCourseRepository::new(pool));
    let service = CourseService::new(app_paths, repo);

    match service.delete(&id).await {
        Ok(course) => (StatusCode::OK, Json(serde_json::json!(course))),
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
