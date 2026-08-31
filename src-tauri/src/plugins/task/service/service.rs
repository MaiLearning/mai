use std::sync::Arc;

use crate::database::repository::task::TaskRepository;
use crate::database::repository::RepoError;

use super::data::{default_task, CustomDifficultyData, TaskData, TaskSnapshotData};
use super::exceptions::TaskServiceError;
use super::rules;

pub(super) fn map_repo_error(e: RepoError, context: &str) -> TaskServiceError {
    match e {
        RepoError::NotFound(msg) => TaskServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            TaskServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            TaskServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

/// Сервис task-плагина: гранулярные операции над контентом,
/// прогрессом прохождения и историей попыток.
pub struct TaskService {
    pub(super) task_repo: Arc<dyn TaskRepository>,
}

impl TaskService {
    pub fn new(task_repo: Arc<dyn TaskRepository>) -> Self {
        Self { task_repo }
    }

    /// Полный снапшот контента ресурса; корень task_content создаётся при отсутствии.
    pub async fn snapshot(&self, resource_id: &str) -> Result<TaskSnapshotData, TaskServiceError> {
        self.task_repo
            .snapshot(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "build task snapshot"))
    }

    /// Создание задачи с дефолтным содержимым по виду (kind-строка от клиента).
    pub async fn create_task(
        &self,
        resource_id: &str,
        kind: &str,
    ) -> Result<TaskData, TaskServiceError> {
        let kind = rules::validate_kind(kind)?;
        let task = default_task(uuid::Uuid::new_v4().to_string(), kind);

        let created = self
            .task_repo
            .create_task(resource_id, task)
            .await
            .map_err(|e| map_repo_error(e, "create task"))?;

        log::info!("Задача создана: {}", created.id);
        Ok(created)
    }

    /// Полное обновление задачи: id из пути и тела должны совпадать,
    /// прогресс прохождения сбрасывается.
    pub async fn update_task_content(
        &self,
        task_id: &str,
        task: TaskData,
    ) -> Result<(), TaskServiceError> {
        if task.id != task_id {
            return Err(TaskServiceError::Validation(format!(
                "Task id mismatch: '{}' vs '{}'",
                task_id, task.id
            )));
        }

        self.task_repo
            .update_task(task_id, task)
            .await
            .map_err(|e| map_repo_error(e, "update task content"))
    }

    /// Обновление сложности задачи.
    pub async fn update_task_difficulty(
        &self,
        task_id: &str,
        difficulty: &str,
    ) -> Result<(), TaskServiceError> {
        self.task_repo
            .update_task_difficulty(task_id, difficulty)
            .await
            .map_err(|e| map_repo_error(e, "update task difficulty"))
    }

    /// Удаление задачи с перенормализацией позиций.
    pub async fn delete_task(&self, task_id: &str) -> Result<(), TaskServiceError> {
        self.task_repo
            .delete_task(task_id)
            .await
            .map_err(|e| map_repo_error(e, "delete task"))?;

        log::info!("Задача удалена: {}", task_id);
        Ok(())
    }

    /// Полная замена набора пользовательских сложностей ресурса.
    pub async fn set_task_difficulties(
        &self,
        resource_id: &str,
        difficulties: Vec<CustomDifficultyData>,
    ) -> Result<(), TaskServiceError> {
        self.task_repo
            .set_difficulties(resource_id, difficulties)
            .await
            .map_err(|e| map_repo_error(e, "set task difficulties"))
    }
}
