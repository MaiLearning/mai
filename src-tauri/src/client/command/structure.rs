use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::services::structure::{DirectoryData, StructureNodeFlat, StructureService};

#[tauri::command]
pub async fn get_structure(
    pool: State<'_, SqlitePool>,
    course_id: String,
) -> Result<Vec<StructureNodeFlat>, String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .get_structure(&course_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_directory(
    pool: State<'_, SqlitePool>,
    course_id: String,
    name: String,
    parent_id: Option<String>,
) -> Result<StructureNodeFlat, String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .create_directory(&course_id, &name, parent_id.as_deref())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_node(pool: State<'_, SqlitePool>, node_id: String) -> Result<(), String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .delete_node(&node_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn rename_node(
    pool: State<'_, SqlitePool>,
    node_id: String,
    name: String,
) -> Result<(), String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .rename_node(&node_id, &name)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn move_node(
    pool: State<'_, SqlitePool>,
    node_id: String,
    new_parent_id: Option<String>,
    position: i64,
) -> Result<(), String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .move_node(&node_id, new_parent_id.as_deref(), position)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_directories(
    pool: State<'_, SqlitePool>,
    course_id: String,
) -> Result<Vec<DirectoryData>, String> {
    let repo = Arc::new(SqliteStructureRepository::new(pool.inner().clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(pool.inner().clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.inner().clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo);
    service
        .get_directories(&course_id)
        .await
        .map_err(|e| e.to_string())
}
