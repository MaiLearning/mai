use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::resource::{ResourceData, ResourceService};
use crate::services::structure::{StructureNodeFlat, StructureService};
use crate::utils::paths::AppPaths;

#[tauri::command]
pub async fn create_resource(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    course_id: String,
    name: String,
    parent_id: Option<String>,
    type_key: Option<String>,
) -> Result<StructureNodeFlat, String> {
    let resource_id = uuid::Uuid::new_v4().to_string();

    // 1. Создать ресурс (зеркалит Axum POST /resources)
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool.inner().clone()));
    let resource_service =
        ResourceService::new(app_paths.inner().clone(), resource_repo, resource_type_repo);

    resource_service
        .create(ResourceData {
            id: resource_id.clone(),
            course_id: course_id.clone(),
            type_key,
            name,
            metadata: serde_json::json!({}),
            files: vec![],
            created_at: 0,
            updated_at: 0,
        })
        .await
        .map_err(|e| e.to_string())?;

    // V11 триггер trg_resource_create_structure уже создал корневой узел структуры

    // 2. Если нужна папка — переместить узел
    if let Some(ref pid) = parent_id {
        let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
        let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
        let res_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
        let structure_service = StructureService::new(repo, dir_repo, res_repo);
        structure_service
            .move_node(&resource_id, Some(pid.as_str()), 0)
            .await
            .map_err(|e| e.to_string())?;
    }

    // 3. Вернуть узел структуры
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let res_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let structure_service = StructureService::new(repo, dir_repo, res_repo);
    structure_service
        .get_structure_node_by_resource(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_resource(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    resource_id: String,
    course_id: String,
    type_key: Option<String>,
    name: String,
) -> Result<ResourceData, String> {
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool.inner().clone()));
    let resource_service =
        ResourceService::new(app_paths.inner().clone(), resource_repo, resource_type_repo);

    let existing = resource_service
        .get(&resource_id)
        .await
        .map_err(|e| e.to_string())?;

    let updated = resource_service
        .update(ResourceData {
            id: existing.id,
            course_id,
            type_key,
            name,
            metadata: existing.metadata,
            files: existing.files,
            created_at: existing.created_at,
            updated_at: 0,
        })
        .await
        .map_err(|e| e.to_string())?;

    Ok(updated)
}
