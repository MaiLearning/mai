//! `mai_get_resource` — карточка ресурса либо полная запись.
//!
//! По умолчанию `brief`: без `metadata` и списка файлов. `full` — только когда
//! содержимое действительно нужно трогать.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;
use schemars::JsonSchema;
use serde::Deserialize;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::ResourceService;

use super::super::dto::ResourceBrief;
use super::super::render;
use super::args::ResourceIdArgs;

pub const NAME: &str = "mai_get_resource";

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct Args {
    #[serde(flatten)]
    pub resource: ResourceIdArgs,
    /// Уровень детализации. `brief` (по умолчанию) — карточка без `metadata`
    /// и файлов; `full` — вся запись ресурса.
    #[serde(default)]
    pub detail: Detail,
}

#[derive(Deserialize, JsonSchema, Default)]
#[serde(rename_all = "lowercase")]
pub enum Detail {
    #[default]
    Brief,
    Full,
}

pub async fn run(state: &AppState, args: Args) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let rt_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool.clone()));
    let service = ResourceService::new(
        state.app_paths.clone(),
        repo,
        rt_repo,
        state.publisher.clone(),
    );

    match service.get(&args.resource.resource_id).await {
        Ok(resource) => match args.detail {
            Detail::Brief => render::json(NAME, &ResourceBrief::from(&resource)),
            Detail::Full => render::json(NAME, &resource),
        },
        Err(e) => render::tool_error(NAME, e),
    }
}
