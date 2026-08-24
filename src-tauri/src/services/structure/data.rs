use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::services::resource::ResourceData;

/// Плоский узел структуры курса.
/// Фронт сам собирает из этого списка иерархическое дерево.
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct StructureNodeFlat {
    pub id: String,
    pub course_id: String,
    pub parent_id: Option<String>,
    pub position: i64,
    pub is_directory: bool,
    pub resource: Option<ResourceData>,
    pub directory_id: Option<String>,
    /// Имя узла: resource.name для ресурсов, directory.name для директорий
    pub name: String,
}

/// Данные директории (группировочный узел структуры).
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct DirectoryData {
    pub id: String,
    pub course_id: String,
    pub name: String,
    pub created_at: i64,
    pub updated_at: i64,
}
