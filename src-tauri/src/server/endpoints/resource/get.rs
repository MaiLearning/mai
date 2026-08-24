use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::services::resource::{ResourceData, ResourceService};
use crate::utils::paths::AppPaths;

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/resources/{id}",
    tag = "resources",
    operation_id = "get_resource",
    params(("id" = String, Path, description = "Resource ID")),
    responses(
        (status = 200, description = "Resource found", body = ResourceData),
        (status = 404, description = "Resource not found")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool));
    let service = ResourceService::new(app_paths, repo, resource_type_repo);

    match service.get(&id).await {
        Ok(resource) => (StatusCode::OK, Json(serde_json::json!(resource))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
