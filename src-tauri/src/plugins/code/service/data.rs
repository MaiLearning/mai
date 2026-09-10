use serde::{Deserialize, Serialize};

/// Строка таблицы `code` — внутреннее представление для слоя репозитория.
#[derive(Debug, Clone)]
pub struct CodeRowData {
    pub resource_id: String,
    pub content: serde_json::Value,
    pub created_at: i64,
    pub updated_at: i64,
}

/// Wire-модель снапшота контента code-ресурса.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CodeContentData {
    pub resource_id: String,
    pub content: serde_json::Value,
    pub created_at: i64,
    pub updated_at: i64,
}

impl From<CodeRowData> for CodeContentData {
    fn from(row: CodeRowData) -> Self {
        Self {
            resource_id: row.resource_id,
            content: row.content,
            created_at: row.created_at,
            updated_at: row.updated_at,
        }
    }
}

/// Результат исполнения программы.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CodeRunResultData {
    pub stdout: String,
    pub stderr: String,
    pub exit_code: Option<i32>,
    pub timed_out: bool,
    pub duration_ms: i64,
}
