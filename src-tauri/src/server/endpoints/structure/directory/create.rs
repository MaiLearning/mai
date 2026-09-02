use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::structure::StructureNodeFlat;
use crate::services::structure::StructureService;

use super::super::router::map_error;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateDirectoryRequest {
    pub course_id: String,
    pub name: String,
    pub parent_id: Option<String>,
}

#[utoipa::path(
    post,
    path = "/structures/directory",
    request_body = CreateDirectoryRequest,
    tag = "structures",
    operation_id = "create_directory",
    responses(
        (status = 201, description = "Directory created", body = StructureNodeFlat),
        (status = 400, description = "Validation error")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<CreateDirectoryRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(state.pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(state.pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(state.pool));
    let service = StructureService::new(repo, dir_repo, resource_repo, state.publisher.clone());

    match service
        .create_directory(&body.course_id, &body.name, body.parent_id.as_deref())
        .await
    {
        Ok(node) => (StatusCode::CREATED, Json(serde_json::json!(node))),
        Err(err) => map_error(err),
    }
}
