use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use serde::Serialize;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::structure::StructureService;

use super::router::map_error;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct MoveNodeRequest {
    pub new_parent_id: Option<String>,
    pub position: i64,
}

#[derive(Serialize, ToSchema)]
pub struct MoveNodeResponse {
    pub status: String,
}

#[utoipa::path(
    patch,
    path = "/structures/{node_id}/move",
    request_body = MoveNodeRequest,
    tag = "structures",
    operation_id = "move_structure_node",
    responses(
        (status = 200, description = "Node moved", body = MoveNodeResponse),
        (status = 400, description = "Validation error"),
        (status = 404, description = "Node not found"),
        (status = 409, description = "Position conflict")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Path(node_id): Path<String>,
    Json(body): Json<MoveNodeRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(state.pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(state.pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(state.pool));
    let service = StructureService::new(repo, dir_repo, resource_repo, state.publisher.clone());

    match service
        .move_node(&node_id, body.new_parent_id.as_deref(), body.position)
        .await
    {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"status": "ok"}))),
        Err(err) => map_error(err),
    }
}
