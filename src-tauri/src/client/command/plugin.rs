use std::sync::Arc;

use serde::Deserialize;
use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::services::events::SharedChangePublisher;
use crate::services::plugin::{PluginData, PluginManifest, PluginService};
use crate::utils::events::ChangePublishers;
use crate::utils::paths::AppPaths;

fn build_service(
    pool: &SqlitePool,
    app_paths: &AppPaths,
    publisher: SharedChangePublisher,
) -> PluginService {
    let plugin_repo = Arc::new(SqlitePluginRepository::new(pool.clone()));
    PluginService::new(app_paths.clone(), plugin_repo, publisher)
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterPluginRequest {
    pub id: String,
    pub name: String,
    pub author: Option<String>,
    pub description: Option<String>,
    pub version: String,
    pub code: String,
    pub sdk_version: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterInternalPluginRequest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub author: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetPluginEnabledRequest {
    pub enabled: bool,
}

#[tauri::command]
pub async fn list_plugins(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
) -> Result<Vec<PluginData>, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .list()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_plugin(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    id: String,
) -> Result<PluginData, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .get(&id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn register_plugin(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    request: RegisterPluginRequest,
) -> Result<PluginData, String> {
    let manifest = PluginManifest {
        id: request.id,
        name: request.name,
        version: request.version,
        main: "index.js".into(),
        description: request.description,
        author: request.author,
        resources: None,
    };

    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .add_external(manifest, request.code.as_bytes(), &request.sdk_version)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn register_internal_plugin(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    request: RegisterInternalPluginRequest,
) -> Result<PluginData, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .add_internal(
            &request.id,
            &request.name,
            &request.version,
            request.description.as_deref(),
            request.author.as_deref(),
        )
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn remove_plugin(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    id: String,
) -> Result<PluginData, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .remove(&id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_plugin_enabled(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    id: String,
    request: SetPluginEnabledRequest,
) -> Result<(), String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .set_enabled(&id, request.enabled)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_plugin_code(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    id: String,
) -> Result<String, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .get_code(&id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_plugin_manifest(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    id: String,
) -> Result<String, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .get_manifest(&id)
        .map_err(|e| e.to_string())
}
