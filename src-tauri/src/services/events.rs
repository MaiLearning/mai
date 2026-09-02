//! Событийная шина изменений сущностей.
//!
//! Сервисы после успешной мутации публикуют [`EntityChanged`] через
//! [`ChangePublisher`] — оба транспорта (Tauri IPC и HTTP API) получают
//! оповещения из одной точки. Доставка подписчикам (сегодня — webview
//! через Tauri events, в будущем — SSE для daemon-сценария) — забота
//! реализации трейта, сервисы о транспорте не знают.

use std::sync::Arc;

use serde::Serialize;

/// Сущность, к которой относится событие изменения.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum EntityKind {
    Course,
    Structure,
    Directory,
}

/// Тип изменения.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ChangeAction {
    Created,
    Updated,
    Deleted,
}

/// Источник мутации: команда фронтенда или запрос внешнего агента по HTTP.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ChangeOrigin {
    Ipc,
    Http,
}

/// Событие об изменении сущности (v1: только сигнал, без данных).
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityChanged {
    pub entity: EntityKind,
    pub action: ChangeAction,
    /// Идентификатор затронутой записи (курс, узел структуры, папка).
    pub id: String,
    /// Идентификатор курса, если событие относится к содержимому курса.
    pub course_id: Option<String>,
}

/// Публикатор событий изменений.
///
/// Экземпляр привязан к источнику (ipc/http): транспорт внедряет в сервис
/// свой скоуп, сервис вызывает `publish` без знания о транспорте.
/// Ошибки доставки не должны влиять на результат мутации (fire-and-forget).
pub trait ChangePublisher: Send + Sync {
    fn publish(&self, event: EntityChanged);
}

/// Общий тип для внедрения паблишера в сервисы и состояния транспортов.
pub type SharedChangePublisher = Arc<dyn ChangePublisher>;
