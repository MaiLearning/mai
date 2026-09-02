use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::structure::StructureService;

use super::super::router::map_error;

#[utoipa::path(
    delete,
    path = "/structures/directory/{id}",
    tag = "structures",
    operation_id = "delete_directory",
    responses(
        (status = 200, description = "Directory deleted"),
        (status = 404, description = "Not found")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Path(node_id): Path<String>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(state.pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(state.pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(state.pool));
    let service = StructureService::new(repo, dir_repo, resource_repo, state.publisher.clone());

    match service.delete_node(&node_id).await {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"status": "ok"}))),
        Err(err) => map_error(err),
    }
}
