use sqlx::SqlitePool;
use tauri::State;

use crate::plugins::code::runtime::build_service;
use crate::plugins::code::service::data::{CodeContentData, CodeRunResultData};

/// Снапшот контента code-ресурса (корень создаётся при отсутствии).
#[tauri::command]
pub async fn code_snapshot(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<CodeContentData, String> {
    build_service(pool.inner())
        .snapshot(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

/// Обновление контента code-ресурса.
#[tauri::command]
pub async fn update_code_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
    content: serde_json::Value,
) -> Result<CodeContentData, String> {
    build_service(pool.inner())
        .update_content(&resource_id, content)
        .await
        .map_err(|e| e.to_string())
}

/// Исполнение кода на настроенном рантайме.
#[tauri::command]
pub async fn code_run(
    pool: State<'_, SqlitePool>,
    language: String,
    code: String,
) -> Result<CodeRunResultData, String> {
    build_service(pool.inner())
        .run(&language, &code)
        .await
        .map_err(|e| e.to_string())
}
