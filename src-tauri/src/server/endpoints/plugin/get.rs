use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::services::plugin::{PluginData, PluginService};
use crate::utils::paths::AppPaths;

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/plugins/{id}",
    tag = "plugins",
    operation_id = "get_plugin",
    params(("id" = String, Path, description = "Plugin ID")),
    responses(
        (status = 200, description = "Plugin found", body = PluginData),
        (status = 404, description = "Plugin not found")
    )
)]
pub async fn handler(
    State((pool, app_paths)): State<(SqlitePool, AppPaths)>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let plugin_repo = Arc::new(SqlitePluginRepository::new(pool));
    let service = PluginService::new(app_paths, plugin_repo);

    match service.get(&id).await {
        Ok(plugin) => (StatusCode::OK, Json(serde_json::json!(plugin))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
