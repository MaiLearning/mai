//! Сборка TaskService per-call: общий для IPC-команд и gateway-обработчиков.

use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::sqlite::repositories::task::SqliteTaskRepository;
use crate::plugins::task::service::TaskService;

/// Сервис собирается per-call (task-сервис событий не публикует — без паблишера).
pub fn build_service(pool: &SqlitePool) -> TaskService {
    let task_repo = Arc::new(SqliteTaskRepository::new(pool.clone()));
    TaskService::new(task_repo)
}
