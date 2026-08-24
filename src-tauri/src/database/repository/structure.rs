use async_trait::async_trait;

use crate::database::repository::RepoResult;
use crate::services::structure::StructureNodeFlat;

#[async_trait]
pub trait StructureRepository: Send + Sync {
    /// Получить плоский список всех узлов структуры курса,
    /// отсортированный по (parent_id NULL first, position).
    async fn get_structure(&self, course_id: &str) -> RepoResult<Vec<StructureNodeFlat>>;

    /// Получить один узел структуры по resource_id (связь 1:1).
    async fn get_structure_node_by_resource(
        &self,
        resource_id: &str,
    ) -> RepoResult<StructureNodeFlat>;

    /// Получить один узел структуры по его id.
    async fn get_node(&self, node_id: &str) -> RepoResult<StructureNodeFlat>;

    /// Создать узел структуры.
    async fn create_node(
        &self,
        id: &str,
        course_id: &str,
        parent_id: Option<&str>,
        position: i64,
        resource_id: Option<&str>,
        directory_id: Option<&str>,
    ) -> RepoResult<StructureNodeFlat>;

    /// Удалить узел структуры по id.
    async fn delete_node(&self, node_id: &str) -> RepoResult<()>;

    /// Получить directory_id для узла (если это директория).
    async fn get_node_directory_id(&self, node_id: &str) -> RepoResult<Option<String>>;

    /// Переместить узел: сменить родителя и/или позицию.
    ///
    /// **Договорённость:**
    /// 1. Узел перемещается под нового родителя (или в корень, если `new_parent_id == None`).
    /// 2. Позиции соседних узлов в старой и новой группах пересчитываются:
    ///    — узлы, находившиеся `position > old_position` в старой группе, сдвигаются на -1;
    ///    — узлы, находившиеся `position >= new_position` в новой группе, сдвигаются на +1;
    /// 3. Если старая и новая группа совпадают, а `position` равен старой позиции — no-op.
    /// 4. Все изменения атомарны (транзакция).
    async fn move_node(
        &self,
        node_id: &str,
        new_parent_id: Option<&str>,
        position: i64,
    ) -> RepoResult<()>;

    /// Получить все id узлов в поддереве (включая сам node_id).
    /// Используется для каскадного удаления.
    async fn get_subtree_ids(&self, node_id: &str) -> RepoResult<Vec<String>>;

    /// Получить resource_id для списка узлов структуры.
    async fn get_resource_ids(&self, node_ids: &[String]) -> RepoResult<Vec<String>>;

    /// Получить directory_id для списка узлов структуры.
    async fn get_directory_ids(&self, node_ids: &[String]) -> RepoResult<Vec<String>>;

    /// Проверить, будет ли перемещение узла под нового родителя циклом.
    async fn would_create_cycle(&self, node_id: &str, parent_id: &str) -> RepoResult<bool>;

    /// Получить course_id для узла.
    async fn get_node_course_id(&self, node_id: &str) -> RepoResult<String>;
}
