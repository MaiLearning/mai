use std::sync::Arc;

use crate::database::repository::task::TaskRepository;
use crate::database::repository::RepoError;

use super::data::TaskContentData;
use super::exceptions::TaskServiceError;

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> TaskServiceError {
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

/// Контент задачи — opaque JSON: структуру знает только плагин на фронте.
fn empty_task_content() -> serde_json::Value {
    serde_json::json!({})
}

pub struct TaskService {
    task_repo: Arc<dyn TaskRepository>,
}

impl TaskService {
    pub fn new(task_repo: Arc<dyn TaskRepository>) -> Self {
        Self { task_repo }
    }

    pub async fn get(&self, resource_id: &str) -> Result<TaskContentData, TaskServiceError> {
        match self.task_repo.get(resource_id).await {
            Ok(data) => Ok(data),
            Err(RepoError::NotFound(_)) => {
                let now = now_millis();
                let data = TaskContentData {
                    resource_id: resource_id.to_string(),
                    content: empty_task_content(),
                    created_at: now,
                    updated_at: now,
                };
                self.task_repo
                    .upsert(data)
                    .await
                    .map_err(|e| map_repo_error(e, "create task content"))
            }
            Err(e) => Err(map_repo_error(e, "get task content")),
        }
    }

    pub async fn save(
        &self,
        resource_id: &str,
        content: serde_json::Value,
    ) -> Result<TaskContentData, TaskServiceError> {
        let now = now_millis();
        let data = TaskContentData {
            resource_id: resource_id.to_string(),
            content,
            created_at: now,
            updated_at: now,
        };

        self.task_repo
            .upsert(data)
            .await
            .map_err(|e| map_repo_error(e, "save task content"))
    }

    pub async fn clear(&self, resource_id: &str) -> Result<TaskContentData, TaskServiceError> {
        self.save(resource_id, empty_task_content()).await
    }

    pub async fn delete(&self, resource_id: &str) -> Result<TaskContentData, TaskServiceError> {
        self.task_repo
            .delete(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "delete task content"))
    }
}
