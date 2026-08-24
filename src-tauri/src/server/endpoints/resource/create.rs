use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::services::resource::{ResourceData, ResourceService};
use crate::utils::paths::AppPaths;

use super::router::map_error;

#[derive(Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateResourceRequest {
    pub id: String,
    pub course_id: String,
    pub type_key: Option<String>,
    pub name: String,
}

#[utoipa::path(
    post,
    path = "/resources",
    request_body = CreateResourceRequest,
    tag = "resources",
    operation_id = "create_resource",
    responses(
        (status = 201, description = "Resource created", body = ResourceData),
        (status = 400, description = "Validation error"),
        (status = 409, description = "Resource already exists")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Json(body): Json<CreateResourceRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool));
    let service = ResourceService::new(app_paths, repo, resource_type_repo);

    let data = ResourceData {
        id: body.id,
        course_id: body.course_id,
        type_key: body.type_key,
        name: body.name,
        metadata: serde_json::json!({}),
        files: vec![],
        created_at: 0,
        updated_at: 0,
    };

    match service.create(data).await {
        Ok(resource) => (StatusCode::CREATED, Json(serde_json::json!(resource))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
