use super::data::{TaskAnswerData, TaskAttemptData};
use super::exceptions::TaskServiceError;
use super::rules;
use super::service::{map_repo_error, TaskService};

impl TaskService {
    /// Сохранить ответ пользователя: вид ответа должен совпадать с видом задачи;
    /// result/completed не трогаются.
    pub async fn submit_task_answer(
        &self,
        task_id: &str,
        answer: TaskAnswerData,
    ) -> Result<(), TaskServiceError> {
        let task_kind = self
            .task_repo
            .task_kind(task_id)
            .await
            .map_err(|e| map_repo_error(e, "submit task answer"))?;
        rules::validate_answer_kind(&task_kind, &answer)?;

        self.task_repo
            .upsert_progress(task_id, answer)
            .await
            .map_err(|e| map_repo_error(e, "submit task answer"))
    }

    /// Зафиксировать результат проверки: опционально сохранить ответ,
    /// проставить result/completed и добавить попытку в историю.
    pub async fn set_task_result(
        &self,
        task_id: &str,
        answer: Option<TaskAnswerData>,
        result: String,
    ) -> Result<(), TaskServiceError> {
        let result = rules::validate_result(&result)?;
        let task_kind = self
            .task_repo
            .task_kind(task_id)
            .await
            .map_err(|e| map_repo_error(e, "set task result"))?;
        if let Some(answer) = &answer {
            rules::validate_answer_kind(&task_kind, answer)?;
        }

        self.task_repo
            .set_task_result(task_id, answer, result)
            .await
            .map_err(|e| map_repo_error(e, "set task result"))?;

        log::info!("Задача проверена: {} — {}", task_id, result.as_str());
        Ok(())
    }

    /// Сброс прогресса прохождения: ответ и result очищаются, completed не трогается.
    pub async fn restart_task(&self, task_id: &str) -> Result<(), TaskServiceError> {
        self.task_repo
            .reset_progress(task_id)
            .await
            .map_err(|e| map_repo_error(e, "restart task"))?;

        log::info!("Прогресс задачи сброшен: {}", task_id);
        Ok(())
    }

    /// История попыток задачи в порядке seq ASC.
    pub async fn list_task_attempts(
        &self,
        task_id: &str,
    ) -> Result<Vec<TaskAttemptData>, TaskServiceError> {
        self.task_repo
            .attempts(task_id)
            .await
            .map_err(|e| map_repo_error(e, "list task attempts"))
    }
}
