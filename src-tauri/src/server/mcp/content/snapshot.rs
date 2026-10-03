//! Проекция для содержимого, лежащего целиком в JSON: задачи и код.
//!
//! Отдельный тип только ради «снимка» плагина — чтение у них одинаковое: у
//! сервиса есть `snapshot(resourceId)`, в котором лежит `content`. Формат
//! `text` для них — компактный JSON: приводить списки задач или файлы к
//! прозе незачем, выигрыш в токенах получился бы обратным.

use serde_json::Value;

use crate::plugins::code::runtime::build_service as build_code_service;
use crate::plugins::code::service::exceptions::CodeServiceError;
use crate::plugins::task::runtime::build_service as build_task_service;
use crate::plugins::task::service::exceptions::TaskServiceError;
use crate::server::state::AppState;

use super::{trim, ContentView, Fetch, FetchError, TrimPaths, Trimmed};

/// Тип ресурса с JSON-содержимым, лежащим в собственном сервисе.
pub struct SnapshotView {
    pub type_keys: &'static [&'static str],
    pub label: &'static str,
    /// Строгое чтение содержимого через сервис типа.
    ///
    /// Именно строгое: ленивые снапшоты сервисов создают корень при первом
    /// чтении, а слой MCP не имеет права писать в БД.
    pub fetch: for<'a> fn(&'a AppState, &'a str) -> Fetch<'a>,
    /// Пути обрезки: коллекция элементов и ключованные по id карты.
    pub paths: TrimPaths<'static>,
}

impl ContentView for SnapshotView {
    fn type_keys(&self) -> &'static [&'static str] {
        self.type_keys
    }

    fn label(&self) -> &'static str {
        self.label
    }

    fn fetch<'a>(&'a self, state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
        (self.fetch)(state, resource_id)
    }

    fn to_text(&self, raw: &Value) -> String {
        serde_json::to_string(raw).unwrap_or_else(|_| raw.to_string())
    }

    fn trim(&self, raw: &Value, budget: usize) -> Option<Trimmed> {
        trim::trim_by_items(raw, &self.paths, budget)
    }
}

/// Строгий task-снапшот: `NotFound` — это «нет содержимого», а не ошибка.
fn map_task_error(e: TaskServiceError) -> FetchError {
    match e {
        TaskServiceError::NotFound(_) => FetchError::NoContent,
        other => FetchError::Read(format!("содержимое задач: {other}")),
    }
}

/// Строгий code-снапшот: `NotFound` — это «нет содержимого», а не ошибка.
fn map_code_error(e: CodeServiceError) -> FetchError {
    match e {
        CodeServiceError::NotFound(_) => FetchError::NoContent,
        other => FetchError::Read(format!("содержимое кода: {other}")),
    }
}

pub fn fetch_task<'a>(state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
    Box::pin(async move {
        let snapshot = build_task_service(&state.pool)
            .snapshot_strict(resource_id)
            .await
            .map_err(map_task_error)?;

        serde_json::to_value(snapshot.content)
            .map_err(|e| FetchError::Read(format!("сериализация: {e}")))
    })
}

pub fn fetch_code<'a>(state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
    Box::pin(async move {
        let snapshot = build_code_service(&state.pool)
            .snapshot_strict(resource_id)
            .await
            .map_err(map_code_error)?;

        Ok(snapshot.content)
    })
}
