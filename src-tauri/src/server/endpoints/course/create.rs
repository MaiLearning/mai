use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::server::state::AppState;
use crate::services::course::{CourseData, CourseService, CourseServiceError};

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateCourseRequest {
    pub id: String,
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
    post,
    path = "/courses",
    request_body = CreateCourseRequest,
    tag = "courses",
    operation_id = "create_course",
    responses(
        (status = 201, description = "Course created", body = CourseData),
        (status = 400, description = "Validation error")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<CreateCourseRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteCourseRepository::new(state.pool));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());

    let data = CourseData {
        id: body.id,
        name: body.name,
        description: body.description,
        tags: body.tags,
        color_from: body.color_from,
        color_to: body.color_to,
        status: body.status.unwrap_or_default(),
        created_at: body.created_at,
        updated_at: body.updated_at,
    };

    match service.create(data).await {
        Ok(course) => (StatusCode::CREATED, Json(serde_json::json!(course))),
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
