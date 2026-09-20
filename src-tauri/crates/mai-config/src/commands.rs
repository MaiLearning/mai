//! Tauri-команда доступа к конфигу.

use std::sync::Arc;

use serde_json::Value;
use tauri::State;

use crate::MaiConfig;

/// Текущий конфиг проекта — распарсенный `mai.toml` как JSON.
///
/// Фронтенд валидирует значение своей zod-схемой (`@mai/config`).
#[tauri::command]
pub fn config_get(state: State<'_, Arc<MaiConfig>>) -> Result<Value, String> {
    Ok(state.current())
}
