use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::server::state::AppState;
use crate::services::plugin::{PluginData, PluginService};

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/plugins",
    tag = "plugins",
    operation_id = "list_plugins",
    responses(
        (status = 200, description = "All plugins", body = [PluginData])
    )
)]
pub async fn handler(State(state): State<AppState>) -> impl IntoResponse {
    let plugin_repo = Arc::new(SqlitePluginRepository::new(state.pool));
    let service = PluginService::new(
        state.app_paths.clone(),
        plugin_repo,
        state.publisher.clone(),
    );

    match service.list().await {
        Ok(plugins) => (StatusCode::OK, Json(serde_json::json!(plugins))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
