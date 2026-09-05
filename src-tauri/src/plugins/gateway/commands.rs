use serde_json::Value;
use sqlx::SqlitePool;
use tauri::State;

use super::data::{GatewayCallRequest, GatewayError, GatewayManifest};
use super::dispatch::dispatch;
use super::registry::gateway_manifests;
use crate::utils::events::ChangePublishers;

/// Вызов gateway-метода плагина.
#[tauri::command]
pub async fn plugin_gateway_call(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    request: GatewayCallRequest,
) -> Result<Value, GatewayError> {
    let pool = pool.inner().clone();
    dispatch(&pool, publishers.ipc.clone(), request).await
}

/// Манифесты gateway всех плагинов (дискавери).
#[tauri::command]
pub fn plugin_gateway_manifests() -> Vec<GatewayManifest> {
    gateway_manifests()
}
