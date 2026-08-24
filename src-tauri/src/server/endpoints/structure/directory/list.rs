use std::sync::Arc;

use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;
use sqlx::SqlitePool;
use utoipa::ToSchema;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::structure::{DirectoryData, StructureService};
use crate::utils::paths::AppPaths;

use super::super::router::map_error;

#[derive(Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ListDirectoriesQuery {
    pub course_id: String,
}

#[utoipa::path(
    get,
    path = "/structures/directory",
    params(
        ("course_id" = String, Query, description = "Course ID")
    ),
    tag = "structures",
    operation_id = "list_directories",
    responses(
        (status = 200, description = "List of directories", body = [DirectoryData])
    )
)]
pub async fn handler(
    State((pool, _app_paths)): State<(SqlitePool, AppPaths)>,
    Query(query): Query<ListDirectoriesQuery>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool));
    let service = StructureService::new(repo, dir_repo, resource_repo);

    match service.get_directories(&query.course_id).await {
        Ok(dirs) => (StatusCode::OK, Json(serde_json::json!(dirs))),
        Err(err) => map_error(err),
    }
}
