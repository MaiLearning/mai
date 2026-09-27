//! `mai_list_plugins` — установленные плагины кратко.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::server::state::AppState;
use crate::services::plugin::PluginService;

use super::super::dto::PluginBrief;
use super::super::render;

pub const NAME: &str = "mai_list_plugins";

pub async fn run(state: &AppState) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqlitePluginRepository::new(state.pool.clone()));
    let service = PluginService::new(state.app_paths.clone(), repo, state.publisher.clone());

    match service.list().await {
        Ok(plugins) => {
            let briefs: Vec<PluginBrief> = plugins.into_iter().map(PluginBrief::from).collect();
            render::json(NAME, &briefs)
        }
        Err(e) => render::tool_error(NAME, e),
    }
}
