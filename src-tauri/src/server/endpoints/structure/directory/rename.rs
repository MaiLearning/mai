use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use sqlx::SqlitePool;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::structure::StructureService;
use crate::utils::paths::AppPaths;

use super::super::router::map_error;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct RenameDirectoryRequest {
    pub name: String,
}

#[utoipa::path(
    patch,
    path = "/structures/directory/{id}",
    request_body = RenameDirectoryRequest,
    tag = "structures",
    operation_id = "rename_directory",
    responses(
        (status = 200, description = "Directory renamed"),
        (status = 400, description = "Validation error"),
        (status = 404, description = "Not found")
    )
)]
pub async fn handler(
    State((pool, _app_paths)): State<(SqlitePool, AppPaths)>,
    Path(node_id): Path<String>,
    Json(body): Json<RenameDirectoryRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool));
    let service = StructureService::new(repo, dir_repo, resource_repo);

    match service.rename_directory(&node_id, &body.name).await {
        Ok(_) => (StatusCode::OK, Json(serde_json::json!({"status": "ok"}))),
        Err(err) => map_error(err),
    }
}
