use std::sync::Arc;

use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::task::SqliteTaskRepository;
use crate::plugins::task::service::data::{
    CustomDifficultyData, TaskAnswerData, TaskAttemptData, TaskData, TaskSnapshotData,
};
use crate::plugins::task::service::TaskService;

fn build_service(pool: &SqlitePool) -> TaskService {
    let task_repo = Arc::new(SqliteTaskRepository::new(pool.clone()));
    TaskService::new(task_repo)
}

/// Полный снапшот контента task-ресурса (корень создаётся при отсутствии).
#[tauri::command]
pub async fn task_snapshot(
    pool: State<'_, SqlitePool>,
    resource_id: String,
) -> Result<TaskSnapshotData, String> {
    build_service(pool.inner())
        .snapshot(&resource_id)
        .await
        .map_err(|e| e.to_string())
}

/// Создание задачи с дефолтным содержимым по kind.
#[tauri::command]
pub async fn create_task(
    pool: State<'_, SqlitePool>,
    resource_id: String,
    kind: String,
) -> Result<TaskData, String> {
    build_service(pool.inner())
        .create_task(&resource_id, &kind)
        .await
        .map_err(|e| e.to_string())
}

/// Полное обновление задачи (id тела должен совпадать с task_id); прогресс сбрасывается.
#[tauri::command]
pub async fn update_task_content(
    pool: State<'_, SqlitePool>,
    task_id: String,
    task: TaskData,
) -> Result<(), String> {
    build_service(pool.inner())
        .update_task_content(&task_id, task)
        .await
        .map_err(|e| e.to_string())
}

/// Обновление сложности задачи.
#[tauri::command]
pub async fn update_task_difficulty(
    pool: State<'_, SqlitePool>,
    task_id: String,
    difficulty: String,
) -> Result<(), String> {
    build_service(pool.inner())
        .update_task_difficulty(&task_id, &difficulty)
        .await
        .map_err(|e| e.to_string())
}

/// Удаление задачи с перенормализацией позиций.
#[tauri::command]
pub async fn delete_task(pool: State<'_, SqlitePool>, task_id: String) -> Result<(), String> {
    build_service(pool.inner())
        .delete_task(&task_id)
        .await
        .map_err(|e| e.to_string())
}

/// Полная замена набора пользовательских сложностей ресурса.
#[tauri::command]
pub async fn set_task_difficulties(
    pool: State<'_, SqlitePool>,
    resource_id: String,
    difficulties: Vec<CustomDifficultyData>,
) -> Result<(), String> {
    build_service(pool.inner())
        .set_task_difficulties(&resource_id, difficulties)
        .await
        .map_err(|e| e.to_string())
}

/// Сохранить ответ пользователя (без фиксации результата).
#[tauri::command]
pub async fn submit_task_answer(
    pool: State<'_, SqlitePool>,
    task_id: String,
    answer: TaskAnswerData,
) -> Result<(), String> {
    build_service(pool.inner())
        .submit_task_answer(&task_id, answer)
        .await
        .map_err(|e| e.to_string())
}

/// Зафиксировать результат проверки + попытка в истории.
#[tauri::command]
pub async fn set_task_result(
    pool: State<'_, SqlitePool>,
    task_id: String,
    answer: Option<TaskAnswerData>,
    result: String,
) -> Result<(), String> {
    build_service(pool.inner())
        .set_task_result(&task_id, answer, result)
        .await
        .map_err(|e| e.to_string())
}

/// Сброс прогресса прохождения.
#[tauri::command]
pub async fn restart_task(pool: State<'_, SqlitePool>, task_id: String) -> Result<(), String> {
    build_service(pool.inner())
        .restart_task(&task_id)
        .await
        .map_err(|e| e.to_string())
}

/// История попыток задачи.
#[tauri::command]
pub async fn list_task_attempts(
    pool: State<'_, SqlitePool>,
    task_id: String,
) -> Result<Vec<TaskAttemptData>, String> {
    build_service(pool.inner())
        .list_task_attempts(&task_id)
        .await
        .map_err(|e| e.to_string())
}
