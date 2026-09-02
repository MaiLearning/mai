use std::sync::Arc;

use serde::Deserialize;
use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::services::events::SharedChangePublisher;
use crate::services::resource::{ResourceService, ResourceTypeData};
use crate::utils::events::ChangePublishers;
use crate::utils::paths::AppPaths;

fn build_service(
    pool: &SqlitePool,
    app_paths: &AppPaths,
    publisher: SharedChangePublisher,
) -> ResourceService {
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool.clone()));
    ResourceService::new(
        app_paths.clone(),
        resource_repo,
        resource_type_repo,
        publisher,
    )
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateResourceTypeRequest {
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    pub plugin_id: Option<String>,
    pub supported_extensions: Vec<String>,
}

#[tauri::command]
pub async fn list_resource_types(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
) -> Result<Vec<ResourceTypeData>, String> {
    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .list_types()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_resource_type(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    publishers: State<'_, ChangePublishers>,
    request: CreateResourceTypeRequest,
) -> Result<ResourceTypeData, String> {
    let data = ResourceTypeData {
        key: request.key,
        name: request.name,
        description: request.description,
        plugin_id: request.plugin_id,
        supported_extensions: request.supported_extensions,
        created_at: 0,
        updated_at: 0,
    };

    build_service(pool.inner(), app_paths.inner(), publishers.ipc.clone())
        .create_type(data)
        .await
        .map_err(|e| e.to_string())
}
