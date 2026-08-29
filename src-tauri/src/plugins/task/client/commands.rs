use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::task::SqliteTaskRepository;
use crate::plugins::task::service::data::TaskContentData;
use crate::plugins::task::service::TaskService;

fn build_service(pool: &SqlitePool) -> TaskService {
    let task_repo = Arc::new(SqliteTaskRepository::new(pool.clone()));
    TaskService::new(task_repo)
}

#[tauri::command]
pub async fn get_task_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TaskContentData, String> {
    build_service(pool.inner())
        .get(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_task_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
    content: serde_json::Value,
) -> Result<TaskContentData, String> {
    build_service(pool.inner())
        .save(&resource_id, content)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_task_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TaskContentData, String> {
    build_service(pool.inner())
        .clear(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_task_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TaskContentData, String> {
    build_service(pool.inner())
        .delete(&resource_id)
        .await
        .map_err(|e| e.to_string())
}
