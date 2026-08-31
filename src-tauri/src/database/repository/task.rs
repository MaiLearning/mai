use async_trait::async_trait;

use super::RepoResult;
use crate::plugins::task::service::data::{
    CustomDifficultyData, TaskAnswerData, TaskAttemptData, TaskData, TaskResultData,
    TaskSnapshotData,
};

/// Гранулярное хранилище task-плагина: реляционные таблицы контента,
/// прогресса прохождения и истории попыток. Модели — wire-контракт плагина.
#[async_trait]
pub trait TaskRepository: Send + Sync {
    /// Гарантирует существование корня task_content для ресурса (get-or-create).
    async fn ensure_root(&self, resource_id: &str) -> RepoResult<()>;

    /// Полный агрегат контента ресурса; корень создаётся при отсутствии.
    async fn snapshot(&self, resource_id: &str) -> RepoResult<TaskSnapshotData>;

    /// Создание задачи с детьми по виду; позиция = max + 1; bump корня.
    async fn create_task(&self, resource_id: &str, task: TaskData) -> RepoResult<TaskData>;

    /// Полное обновление задачи (скаляры + перезапись детей);
    /// строка прогресса удаляется; bump корня.
    async fn update_task(&self, task_id: &str, task: TaskData) -> RepoResult<()>;

    /// Обновление сложности задачи; bump корня.
    async fn update_task_difficulty(&self, task_id: &str, difficulty: &str) -> RepoResult<()>;

    /// Удаление задачи + перенормализация позиций; bump корня.
    async fn delete_task(&self, task_id: &str) -> RepoResult<()>;

    /// Полная замена набора пользовательских сложностей ресурса; bump корня.
    async fn set_difficulties(
        &self,
        resource_id: &str,
        difficulties: Vec<CustomDifficultyData>,
    ) -> RepoResult<()>;

    /// Вид задачи (значение колонки kind); NotFound если задачи нет.
    async fn task_kind(&self, task_id: &str) -> RepoResult<String>;

    /// Upsert прогресса ответом (result/completed не трогаются); bump корня.
    async fn upsert_progress(&self, task_id: &str, answer: TaskAnswerData) -> RepoResult<()>;

    /// Фиксация результата: upsert прогресса (если есть answer), result/completed,
    /// новая попытка со снимком ответа; bump корня.
    async fn set_task_result(
        &self,
        task_id: &str,
        answer: Option<TaskAnswerData>,
        result: TaskResultData,
    ) -> RepoResult<()>;

    /// Сброс прогресса: скаляры/дети ответа очищаются, result = NULL;
    /// completed не трогается; bump корня.
    async fn reset_progress(&self, task_id: &str) -> RepoResult<()>;

    /// Попытки задачи в порядке seq ASC.
    async fn attempts(&self, task_id: &str) -> RepoResult<Vec<TaskAttemptData>>;
}
