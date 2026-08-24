use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use sqlx::SqlitePool;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::services::course::{CourseData, CourseService, CourseServiceError};
use crate::utils::paths::AppPaths;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCourseRequest {
    pub name: String,
    pub description: Option<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    pub color_from: Option<String>,
    pub color_to: Option<String>,
    pub status: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[utoipa::path(
    put,
    path = "/courses/{id}",
    request_body = UpdateCourseRequest,
    tag = "courses",
    operation_id = "update_course",
    responses(
        (status = 200, description = "Course updated", body = CourseData),
        (status = 404, description = "Course not found")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Path(id): Path<String>,
    Json(body): Json<UpdateCourseRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteCourseRepository::new(pool));
    let service = CourseService::new(app_paths, repo);

    let data = CourseData {
        id,
        name: body.name,
        description: body.description,
        tags: body.tags,
        color_from: body.color_from,
        color_to: body.color_to,
        status: body.status.unwrap_or_default(),
        created_at: body.created_at,
        updated_at: body.updated_at,
    };

    match service.update(data).await {
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
