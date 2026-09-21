use serde::Deserialize;
use serde::Serialize;

/// Настройки пункта (domain, item_id): самодостаточный JSON-документ.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsItemData {
    /// Область настроек: `system` | `plugin` | `course` (валидируется в rules).
    pub domain: String,
    /// Идентификатор пункта: секция для system, pluginId для plugin, courseId для course.
    pub item_id: String,
    /// JSON-документ пункта: карта «поле → описание+значение» (self-describing).
    pub settings: serde_json::Value,
    /// Версия схемы документа (по умолчанию 1).
    pub schema_version: i64,
    pub created_at: i64,
    pub updated_at: i64,
}
