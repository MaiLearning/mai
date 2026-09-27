//! Чтение MCP-ресурсов Mai: справочные документы под `mai://guide/`.
//!
//! В отличие от `tools/` это примитив «прочитать по URI» — без аргументов
//! выбора и без побочных эффектов. Используется для документации, которую
//! агент читает по необходимости, а не всегда.

mod registry;

use rmcp::model::{ListResourcesResult, ReadResourceResult, ResourceContents};
use rmcp::ErrorData;

pub use registry::ResourceDef;

/// Каталог статических ресурсов для `resources/list`.
pub fn list() -> ListResourcesResult {
    ListResourcesResult::with_all_items(
        registry::all()
            .iter()
            .map(ResourceDef::to_resource)
            .collect(),
    )
}

/// Тело ресурса по URI для `resources/read`.
pub fn read(uri: &str) -> Result<ReadResourceResult, ErrorData> {
    let def = registry::find(uri)?;
    let contents = ResourceContents::text(def.body, def.uri).with_mime_type("text/markdown");

    Ok(ReadResourceResult::new(vec![contents]))
}
