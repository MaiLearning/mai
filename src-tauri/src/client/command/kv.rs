use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::kv::SqliteKvRepository;
use crate::services::kv::{KvEntryData, KvService};

fn build_service(pool: &SqlitePool) -> KvService {
    let kv_repo = Arc::new(SqliteKvRepository::new(pool.clone()));
    KvService::new(kv_repo)
}

#[tauri::command]
pub async fn kv_set(
    pool: State<'_, SqlitePool>,
    key: String,
    value: serde_json::Value,
) -> Result<KvEntryData, String> {
    build_service(pool.inner())
        .set(&key, value)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn kv_get(
    pool: State<'_, SqlitePool>,
    key: String,
) -> Result<Option<serde_json::Value>, String> {
    build_service(pool.inner())
        .get(&key)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn kv_delete(pool: State<'_, SqlitePool>, key: String) -> Result<bool, String> {
    build_service(pool.inner())
        .delete(&key)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn kv_exists(pool: State<'_, SqlitePool>, key: String) -> Result<bool, String> {
    build_service(pool.inner())
        .exists(&key)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn kv_list_keys(
    pool: State<'_, SqlitePool>,
    prefix: Option<String>,
) -> Result<Vec<String>, String> {
    build_service(pool.inner())
        .list_keys(prefix.as_deref())
        .await
        .map_err(|e| e.to_string())
}
