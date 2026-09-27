//! Рендер ответов инструментов MCP.
//!
//! Единственная точка, где содержимое ответа инструмента превращается в
//! `CallToolResult`: агент читает результат как текст, поэтому бюджет
//! символов измеряется здесь же.
//!
//! Правила (см. `MCP.md`):
//!
//! - **только компактный JSON** — `to_string_pretty` на вложенных объектах
//!   даёт до +30% чисто пробельного мусора;
//! - **кап размера**: ответ длиннее [`MAX_RESULT_CHARS`] не режется молча —
//!   текст режется по границе символа с явным хвостом-подсказкой;
//! - **метрики**: каждый ответ логируется с оценкой токенов, иначе
//!   оптимизацию токенов нечем измерить.

use std::fmt::Display;

pub mod outline;

use log::info;
use rmcp::model::{CallToolResult, ContentBlock};
use rmcp::ErrorData;
use serde::Serialize;

/// Кап размера одного ответа инструмента, в символах.
pub const MAX_RESULT_CHARS: usize = 40_000;

/// Грубая оценка: символов на токен для русского текста и JSON.
const CHARS_PER_TOKEN: usize = 3;

/// Текстовый ответ инструмента: `body` режется по [`MAX_RESULT_CHARS`].
pub fn text(tool: &str, body: String) -> CallToolResult {
    let total = body.chars().count();
    if total <= MAX_RESULT_CHARS {
        return logged(tool, total, false, body);
    }

    let hint = "обрезано по лимиту ответа: сузь выборку (mai_search, mai_course_outline с rootId/depth, mai_get_content для одного ресурса)";
    let kept: String = body.chars().take(MAX_RESULT_CHARS).collect();
    let notice = format!(
        "\n\n--- [усечено: {kept_len} из {total} символов] ---\n{hint}\n",
        kept_len = kept.chars().count()
    );
    logged(tool, total, true, format!("{kept}{notice}"))
}

/// Компактный JSON строкой — для случаев, когда результат встраивается в
/// текстовый ответ (шапка + данные).
pub fn json_string(data: &impl Serialize) -> Result<String, ErrorData> {
    serde_json::to_string(data)
        .map_err(|e| ErrorData::internal_error(format!("ошибка сериализации: {e}"), None))
}

/// JSON-ответ инструмента: компактной сериализацией.
pub fn json(tool: &str, data: &impl Serialize) -> Result<CallToolResult, ErrorData> {
    Ok(text(tool, json_string(data)?))
}

/// Tool-level ошибка: «выполнено, но не получилось» (не найдено, невалидные
/// данные).
///
/// Именно результат с `isError`, а не JSON-RPC ошибка: по протоколу MCP
/// ошибку исполнения инструмента агент должен увидеть текстом и иметь шанс
/// исправиться (позвать другой id, сузить выборку). JSON-RPC ошибка — это
/// протокольные неполадки (неизвестный инструмент, битые параметры), и агент
/// на них только остановится.
pub fn tool_error(tool: &str, e: impl Display) -> Result<CallToolResult, ErrorData> {
    Ok(CallToolResult::error(vec![ContentBlock::text(format!(
        "{tool}: {e}"
    ))]))
}

fn logged(tool: &str, total: usize, truncated: bool, body: String) -> CallToolResult {
    let chars = body.chars().count();
    let tail = if truncated {
        format!(", усечено из {total}")
    } else {
        String::new()
    };
    info!(
        "MCP {tool}: {chars} симв. (~{} ток.){tail}",
        chars / CHARS_PER_TOKEN + 1
    );
    CallToolResult::success(vec![ContentBlock::text(body)])
}

#[cfg(test)]
mod tests {
    use super::*;

    fn body(result: &CallToolResult) -> String {
        match &result.content[0] {
            ContentBlock::Text(t) => t.text.clone(),
            other => panic!("не текстовый блок: {other:?}"),
        }
    }

    #[test]
    fn json_компактный_без_переводов_строк() {
        let value = serde_json::json!({"a": 1, "b": [1, 2]});
        let result = json("t", &value).unwrap();
        assert_eq!(body(&result), r#"{"a":1,"b":[1,2]}"#);
    }

    #[test]
    fn текст_короче_лимита_идёт_как_есть() {
        assert_eq!(body(&text("t", "коротко".to_string())), "коротко");
    }

    #[test]
    fn длинный_текст_обрезается_с_подсказкой() {
        let out = body(&text("t", "я".repeat(MAX_RESULT_CHARS + 1000)));
        assert!(out.starts_with("яяяя"));
        assert!(out.contains("[усечено: 40000 из 41000 символов]"));
        assert!(out.contains("mai_search"));
    }

    #[test]
    fn обрезка_не_рвёт_многобайтовый_символ() {
        let out = body(&text("t", "ё".repeat(MAX_RESULT_CHARS + 10)));
        assert!(out.contains("[усечено: 40000 из 40010 символов]"));
    }

    #[test]
    fn ошибка_инструмента_приходит_текстом_в_результате() {
        let result = tool_error("t", "не найдено").unwrap();
        assert_eq!(result.is_error, Some(true));
        assert!(body(&result).contains("t: не найдено"));
    }
}
