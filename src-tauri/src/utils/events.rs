//! Доставка событий изменений в webview через Tauri events.
//!
//! [`TauriChangePublisher`] — реализация [`ChangePublisher`], привязанная
//! к источнику (ipc/http). Пара скоуп-паблишеров ([`ChangePublishers`])
//! внедряется в состояния транспортов при старте приложения.

use log::warn;
use serde::Serialize;
use tauri::{AppHandle, Emitter};

use crate::services::events::{
    ChangeOrigin, ChangePublisher, EntityChanged, SharedChangePublisher,
};

/// Имя Tauri-события, по которому webview получает оповещения об изменениях.
pub const ENTITY_CHANGED_EVENT: &str = "entity://changed";

/// Полный payload события: событие + источник + время (unix, мс).
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct ChangePayload<'a> {
    origin: ChangeOrigin,
    timestamp: i64,
    #[serde(flatten)]
    event: &'a EntityChanged,
}

/// Публикатор изменений, привязанный к источнику (ipc или http).
#[derive(Clone)]
pub struct TauriChangePublisher {
    app_handle: AppHandle,
    origin: ChangeOrigin,
}

/// Пара скоуп-паблишеров для внедрения в транспорты.
#[derive(Clone)]
pub struct ChangePublishers {
    /// Для Tauri-команд (мутации, инициированные фронтендом).
    pub ipc: SharedChangePublisher,
    /// Для HTTP-эндпоинтов (мутации внешних агентов).
    pub http: SharedChangePublisher,
}

impl TauriChangePublisher {
    pub fn new(app_handle: AppHandle, origin: ChangeOrigin) -> Self {
        Self { app_handle, origin }
    }
}

impl ChangePublisher for TauriChangePublisher {
    fn publish(&self, event: EntityChanged) {
        let payload = ChangePayload {
            origin: self.origin,
            timestamp: now_millis(),
            event: &event,
        };

        if let Err(e) = self.app_handle.emit(ENTITY_CHANGED_EVENT, payload) {
            warn!("Не удалось доставить событие изменения в webview: {}", e);
        }
    }
}

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::events::{ChangeAction, EntityKind};

    #[test]
    fn payload_uses_camel_case_keys() {
        let event = EntityChanged {
            entity: EntityKind::Course,
            action: ChangeAction::Updated,
            id: "c-1".to_string(),
            course_id: None,
        };
        let payload = ChangePayload {
            origin: ChangeOrigin::Http,
            timestamp: 42,
            event: &event,
        };

        let json = serde_json::to_value(&payload).unwrap();

        assert_eq!(json["entity"], "course");
        assert_eq!(json["action"], "updated");
        assert_eq!(json["origin"], "http");
        assert_eq!(json["id"], "c-1");
        assert_eq!(json["courseId"], serde_json::Value::Null);
        assert_eq!(json["timestamp"], 42);
    }

    #[test]
    fn entity_kind_resource_type_serializes_camel_case() {
        let event = EntityChanged {
            entity: EntityKind::ResourceType,
            action: ChangeAction::Created,
            id: "theory".to_string(),
            course_id: None,
        };

        let json = serde_json::to_value(&event).unwrap();

        assert_eq!(json["entity"], "resourceType");
        assert_eq!(json["action"], "created");
        assert_eq!(json["id"], "theory");
        assert_eq!(json["courseId"], serde_json::Value::Null);
    }
}
