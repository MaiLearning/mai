use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::structure::{StructureNodeFlat, StructureService};
use crate::utils::paths::AppPaths;

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/structures/by-course/{course_id}",
    tag = "structures",
    operation_id = "get_structure_by_course",
    responses(
        (status = 200, description = "Structure nodes for course", body = [StructureNodeFlat])
    )
)]
pub async fn handler(
    State((pool, _app_paths)): State<(SqlitePool, AppPaths)>,
    Path(course_id): Path<String>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteStructureRepository::new(pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool));
    let service = StructureService::new(repo, dir_repo, resource_repo);

    match service.get_structure(&course_id).await {
        Ok(nodes) => (StatusCode::OK, Json(serde_json::json!(nodes))),
        Err(err) => map_error(err),
    }
}
