use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::theory::SqliteTheoryRepository;
use crate::plugins::theory::service::data::TheoryContentData;
use crate::plugins::theory::service::TheoryService;

fn build_service(pool: &SqlitePool) -> TheoryService {
    let theory_repo = Arc::new(SqliteTheoryRepository::new(pool.clone()));
    TheoryService::new(theory_repo)
}

#[tauri::command]
pub async fn get_theory_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TheoryContentData, String> {
    build_service(pool.inner())
        .get(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_theory_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
    content: serde_json::Value,
) -> Result<TheoryContentData, String> {
    build_service(pool.inner())
        .save(&resource_id, content)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_theory_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TheoryContentData, String> {
    build_service(pool.inner())
        .clear(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_theory_content(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TheoryContentData, String> {
    build_service(pool.inner())
        .delete(&resource_id)
        .await
        .map_err(|e| e.to_string())
}
