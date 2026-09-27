//! DTO для агента: проекции доменных моделей под нужный объём.
//!
//! Доменные структуры из `services/*/data.rs` — это контракт приложения и
//! HTTP (его же ест utoipa), там нужен full fidelity. Агенту нужно другое:
//! карточки для выбора и полный объём только по явному запросу. Поэтому
//! наружу MCP-модели не отдаются, а строятся здесь.
//!
//! Уровни детализации: **brief** — по умолчанию, **full** — по запросу.
//! Пикер полей (`fields: [...]`) не используется намеренно: агент выбирает
//! набор неверно и повторяет вызов, тогда как один переключатель
//! `detail` предсказуем.

use serde::Serialize;

use crate::services::course::CourseData;
use crate::services::plugin::{PluginData, PluginKind};
use crate::services::resource::ResourceData;

/// Карточка курса: достаточно для выбора, без дат и цветов.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CourseBrief {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub tags: Vec<String>,
    /// draft | in_progress | completed
    pub status: String,
}

impl From<CourseData> for CourseBrief {
    fn from(c: CourseData) -> Self {
        Self {
            id: c.id,
            name: c.name,
            description: c.description,
            tags: c.tags,
            status: c.status,
        }
    }
}

/// Карточка ресурса: без `metadata` и списка файлов.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResourceBrief {
    pub id: String,
    pub course_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub type_key: Option<String>,
    pub name: String,
    /// Миллисекунды эпохи: агент по нему видит свежесть данных.
    pub updated_at: i64,
}

impl From<&ResourceData> for ResourceBrief {
    fn from(r: &ResourceData) -> Self {
        Self {
            id: r.id.clone(),
            course_id: r.course_id.clone(),
            type_key: r.type_key.clone(),
            name: r.name.clone(),
            updated_at: r.updated_at,
        }
    }
}

/// Карточка плагина: владелец типа ресурса и состояние включения.
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginBrief {
    pub id: String,
    pub name: String,
    pub version: String,
    pub enabled: bool,
    pub kind: PluginKind,
}

impl From<PluginData> for PluginBrief {
    fn from(p: PluginData) -> Self {
        Self {
            id: p.id,
            name: p.name,
            version: p.version,
            enabled: p.enabled,
            kind: p.kind,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn resource() -> ResourceData {
        ResourceData {
            id: "r-1".into(),
            course_id: "c-1".into(),
            type_key: Some("theory".into()),
            name: "Лекция".into(),
            metadata: json!({"разметка": "богатая"}),
            files: vec!["a.rs".into()],
            created_at: 1,
            updated_at: 2,
        }
    }

    #[test]
    fn карточка_не_тащит_метаданные_и_файлы() {
        let brief = serde_json::to_value(ResourceBrief::from(&resource())).unwrap();
        assert_eq!(brief["id"], "r-1");
        assert_eq!(brief["typeKey"], "theory");
        assert_eq!(brief["updatedAt"], 2);
        assert!(brief.get("metadata").is_none());
        assert!(brief.get("files").is_none());
        assert!(brief.get("createdAt").is_none());
    }

    #[test]
    fn пустой_тип_и_пустое_описание_опускаются() {
        let mut r = resource();
        r.type_key = None;
        let brief = serde_json::to_value(ResourceBrief::from(&r)).unwrap();
        assert!(brief.get("typeKey").is_none());

        let course = CourseData {
            id: "c-1".into(),
            name: "Курс".into(),
            description: None,
            tags: vec![],
            color_from: None,
            color_to: None,
            status: "draft".into(),
            created_at: 1,
            updated_at: 2,
        };
        let brief = serde_json::to_value(CourseBrief::from(course)).unwrap();
        assert_eq!(
            brief,
            json!({"id": "c-1", "name": "Курс", "status": "draft"})
        );
    }
}
