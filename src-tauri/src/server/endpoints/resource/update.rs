use std::sync::Arc;

use axum::extract::{Path, State};
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
pub struct UpdateResourceRequest {
    pub course_id: String,
    pub type_key: Option<String>,
    pub name: String,
    pub metadata: Option<serde_json::Value>,
    pub files: Option<Vec<String>>,
}

#[utoipa::path(
    put,
    path = "/resources/{id}",
    request_body = UpdateResourceRequest,
    tag = "resources",
    operation_id = "update_resource",
    params(("id" = String, Path, description = "Resource ID")),
    responses(
        (status = 200, description = "Resource updated", body = ResourceData),
        (status = 400, description = "Validation error"),
        (status = 404, description = "Resource not found")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Path(id): Path<String>,
    Json(body): Json<UpdateResourceRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool));
    let service = ResourceService::new(app_paths, repo, resource_type_repo);

    let data = ResourceData {
        id,
        course_id: body.course_id,
        type_key: body.type_key,
        name: body.name,
        metadata: body.metadata.unwrap_or(serde_json::json!({})),
        files: body.files.unwrap_or_default(),
        created_at: 0,
        updated_at: 0,
    };

    match service.update(data).await {
        Ok(resource) => (StatusCode::OK, Json(serde_json::json!(resource))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
