use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::services::resource::{ResourceService, ResourceTypeData};
use crate::utils::paths::AppPaths;

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/resource-types",
    tag = "resource_types",
    operation_id = "list_resource_types",
    responses(
        (status = 200, description = "All resource types", body = [ResourceTypeData])
    )
)]
pub async fn handler(State((pool, app_paths)): State<(SqlitePool, AppPaths)>) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool));
    let service = ResourceService::new(app_paths, repo, resource_type_repo);

    match service.list_types().await {
        Ok(types) => (StatusCode::OK, Json(serde_json::json!(types))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
