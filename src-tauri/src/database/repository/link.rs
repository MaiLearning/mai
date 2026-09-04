use async_trait::async_trait;

use super::RepoResult;
use crate::plugins::link::service::data::{LinkData, LinkSourceRef, LinkTargetData};

/// Хранилище рёбер графа связей (link-плагин). Модели — wire-контракт плагина.
///
/// targetStatus в БД не хранится: возвращаемое LinkData несёт заглушку
/// LinkStatus::Ok, итоговое значение вычисляет сервис (resolve_target_status).
#[async_trait]
pub trait LinkRepository: Send + Sync {
    /// Вставка ребра; конфликт первичного ключа → Conflict.
    async fn insert(&self, data: LinkData) -> RepoResult<()>;

    /// Ребро по id; NotFound если нет.
    async fn get(&self, id: &str) -> RepoResult<LinkData>;

    /// Обновление изменяемых полей (title, description, target, updated_at);
    /// source/owner/created_at не трогаются; NotFound если ребра нет.
    async fn update(&self, data: LinkData) -> RepoResult<()>;

    /// Удаление ребра по id.
    async fn delete(&self, id: &str) -> RepoResult<()>;

    /// Пачечное удаление рёбер по id; возвращает число удалённых строк.
    async fn delete_by_ids(&self, ids: &[String]) -> RepoResult<u64>;

    /// Рёбра указанного источника (source_type + source_id).
    async fn list_by_source(&self, source_type: &str, source_id: &str)
        -> RepoResult<Vec<LinkData>>;

    /// Рёбра, ведущие в указанную цель.
    async fn list_by_target(&self, target: &LinkTargetData) -> RepoResult<Vec<LinkData>>;

    /// Рёбра курса: источник — сам курс или ресурс этого курса (JOIN с resources).
    async fn list_by_course(&self, course_id: &str) -> RepoResult<Vec<LinkData>>;

    /// Distinct-пары (source_type, source_id) по всем рёбрам — для sweep.
    async fn list_source_refs(&self) -> RepoResult<Vec<LinkSourceRef>>;
}
