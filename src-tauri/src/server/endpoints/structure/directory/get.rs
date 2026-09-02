use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::structure::{DirectoryData, StructureService, StructureServiceError};

use super::super::router::map_error;

#[utoipa::path(
    get,
    path = "/structures/directory/{id}",
    tag = "structures",
    operation_id = "get_directory",
    responses(
        (status = 200, description = "Directory data", body = DirectoryData),
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

    let node = match service.get_node(&node_id).await {
        Ok(n) => n,
        Err(err) => return map_error(err),
    };

    let dir_id = match node.directory_id {
        Some(id) => id,
        None => {
            return map_error(StructureServiceError::NotFound(
                "Node is not a directory.".into(),
            ));
        }
    };

    match service.get_directory(&dir_id).await {
        Ok(dir) => (StatusCode::OK, Json(serde_json::json!(dir))),
        Err(err) => map_error(err),
    }
}
