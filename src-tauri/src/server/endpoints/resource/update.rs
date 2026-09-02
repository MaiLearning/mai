use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::{ResourceData, ResourceService};

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
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<UpdateResourceRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool));
    let service = ResourceService::new(
        state.app_paths.clone(),
        repo,
        resource_type_repo,
        state.publisher.clone(),
    );

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
