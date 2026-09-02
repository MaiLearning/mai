use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::server::state::AppState;
use crate::services::plugin::PluginService;

use super::router::map_error;

#[derive(Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct SetPluginEnabledRequest {
    pub enabled: bool,
}

#[utoipa::path(
    patch,
    path = "/plugins/{id}/enabled",
    request_body = SetPluginEnabledRequest,
    tag = "plugins",
    operation_id = "set_plugin_enabled",
    params(("id" = String, Path, description = "Plugin ID")),
    responses(
        (status = 204, description = "Plugin enabled state updated"),
        (status = 404, description = "Plugin not found")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<SetPluginEnabledRequest>,
) -> impl IntoResponse {
    let plugin_repo = Arc::new(SqlitePluginRepository::new(state.pool));
    let service = PluginService::new(state.app_paths.clone(), plugin_repo);

    match service.set_enabled(&id, body.enabled).await {
        Ok(()) => (StatusCode::NO_CONTENT).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
