use super::data::{TaskAnswerData, TaskKind, TaskResultData};
use super::exceptions::TaskServiceError;

/// kind-строка от клиента должна быть одним из известных видов задач.
pub fn validate_kind(kind: &str) -> Result<TaskKind, TaskServiceError> {
    TaskKind::parse(kind)
        .ok_or_else(|| TaskServiceError::Validation(format!("Unknown task kind '{}'", kind)))
}

/// Вид ответа должен совпадать с видом задачи.
pub fn validate_answer_kind(
    task_kind: &str,
    answer: &TaskAnswerData,
) -> Result<(), TaskServiceError> {
    if answer.kind_name() == task_kind {
        Ok(())
    } else {
        Err(TaskServiceError::Validation(format!(
            "Answer kind '{}' does not match task kind '{}'",
            answer.kind_name(),
            task_kind
        )))
    }
}

/// Результат проверки: только 'correct' | 'incorrect'.
pub fn validate_result(result: &str) -> Result<TaskResultData, TaskServiceError> {
    TaskResultData::parse(result)
        .ok_or_else(|| TaskServiceError::Validation(format!("Unknown task result '{}'", result)))
}
