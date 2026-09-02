use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::server::state::AppState;
use crate::services::plugin::{PluginData, PluginManifest, PluginService};

use super::router::map_error;

#[derive(Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct RegisterPluginRequest {
    pub id: String,
    pub name: String,
    pub author: Option<String>,
    pub description: Option<String>,
    pub version: String,
    pub code: String,
    pub sdk_version: String,
}

#[utoipa::path(
    post,
    path = "/plugins",
    request_body = RegisterPluginRequest,
    tag = "plugins",
    operation_id = "register_plugin",
    responses(
        (status = 201, description = "Plugin registered", body = PluginData),
        (status = 400, description = "Validation error"),
        (status = 409, description = "Plugin already exists")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<RegisterPluginRequest>,
) -> impl IntoResponse {
    let plugin_repo = Arc::new(SqlitePluginRepository::new(state.pool));
    let service = PluginService::new(state.app_paths.clone(), plugin_repo);

    let manifest = PluginManifest {
        id: body.id,
        name: body.name,
        version: body.version,
        main: "index.js".into(),
        description: body.description,
        author: body.author,
        resources: None,
    };

    match service
        .add_external(manifest, body.code.as_bytes(), &body.sdk_version)
        .await
    {
        Ok(plugin) => (StatusCode::CREATED, Json(serde_json::json!(plugin))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
