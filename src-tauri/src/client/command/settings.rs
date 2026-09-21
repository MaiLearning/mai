use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::settings::SqliteSettingsRepository;
use crate::services::settings::{SettingsItemData, SettingsService};

fn build_service(pool: &SqlitePool) -> SettingsService {
    let settings_repo = Arc::new(SqliteSettingsRepository::new(pool.clone()));
    SettingsService::new(settings_repo)
}

#[tauri::command]
pub async fn settings_get(
    pool: State<'_, SqlitePool>,
    domain: String,
    item_id: String,
) -> Result<Option<SettingsItemData>, String> {
    build_service(pool.inner())
        .get(&domain, &item_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn settings_update(
    pool: State<'_, SqlitePool>,
    domain: String,
    item_id: String,
    settings: serde_json::Value,
) -> Result<SettingsItemData, String> {
    build_service(pool.inner())
        .update(&domain, &item_id, settings)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn settings_delete(
    pool: State<'_, SqlitePool>,
    domain: String,
    item_id: String,
) -> Result<bool, String> {
    build_service(pool.inner())
        .delete(&domain, &item_id)
        .await
        .map_err(|e| e.to_string())
}
