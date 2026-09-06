//! MCP-обработчик Mai: состояние и общие хелперы tool-результатов.

use rmcp::model::{CallToolResult, ContentBlock};
use rmcp::ErrorData;
use serde::Serialize;

use crate::server::state::AppState;

/// MCP-обработчик Mai. Клон дёшев (внутри Arc); на каждый запрос
/// фабрика создаёт свежий экземпляр.
#[derive(Clone)]
pub struct MaiMcpServer {
    pub(crate) state: AppState,
}

impl MaiMcpServer {
    pub fn new(state: AppState) -> Self {
        Self { state }
    }
}

/// Успешный tool-результат: данные как pretty-JSON текст.
pub(crate) fn json_tool(data: &impl Serialize) -> Result<CallToolResult, ErrorData> {
    let text = serde_json::to_string_pretty(data)
        .map_err(|e| ErrorData::internal_error(format!("Ошибка сериализации: {e}"), None))?;
    Ok(CallToolResult::success(vec![ContentBlock::text(text)]))
}

/// Tool-результат «выполнено, но не получилось» (не найдено, невалидные
/// данные): сообщение доходит до агента текстом (tool-level error).
pub(crate) fn tool_error(e: impl std::fmt::Display) -> Result<CallToolResult, ErrorData> {
    Ok(CallToolResult::error(vec![ContentBlock::text(
        e.to_string(),
    )]))
}
