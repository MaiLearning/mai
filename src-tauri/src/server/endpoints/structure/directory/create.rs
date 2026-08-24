use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use sqlx::SqlitePool;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::structure::StructureNodeFlat;
use crate::services::structure::StructureService;
use crate::utils::paths::AppPaths;

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
    State((pool, _app_paths)): State<(SqlitePool, AppPaths)>,
    Json(body): Json<CreateDirectoryRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool));
    let service = StructureService::new(repo, dir_repo, resource_repo);

    match service
        .create_directory(&body.course_id, &body.name, body.parent_id.as_deref())
        .await
    {
        Ok(node) => (StatusCode::CREATED, Json(serde_json::json!(node))),
        Err(err) => map_error(err),
    }
}
