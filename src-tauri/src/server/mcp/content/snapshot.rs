//! Проекция для содержимого, лежащего целиком в JSON: задачи и код.
//!
//! Отдельный тип только ради «снимка» плагина — чтение у них одинаковое: у
//! сервиса есть `snapshot(resourceId)`, в котором лежит `content`. Формат
//! `text` для них — компактный JSON: приводить списки задач или файлы к
//! прозе незачем, выигрыш в токенах получился бы обратным.

use serde_json::Value;

use crate::plugins::code::runtime::build_service as build_code_service;
use crate::plugins::task::runtime::build_service as build_task_service;
use crate::server::state::AppState;

use super::{ContentView, Fetch};

/// Тип ресурса с JSON-содержимым, лежащим в собственном сервисе.
pub struct SnapshotView {
    pub type_keys: &'static [&'static str],
    pub label: &'static str,
    /// Чтение через снимок сервиса типа.
    pub fetch: for<'a> fn(&'a AppState, &'a str) -> Fetch<'a>,
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
}

pub fn fetch_task<'a>(state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
    Box::pin(async move {
        let snapshot = build_task_service(&state.pool)
            .snapshot(resource_id)
            .await
            .map_err(|e| format!("содержимое задач: {e}"))?;

        serde_json::to_value(snapshot.content).map_err(|e| format!("сериализация: {e}"))
    })
}

pub fn fetch_code<'a>(state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
    Box::pin(async move {
        let snapshot = build_code_service(&state.pool)
            .snapshot(resource_id)
            .await
            .map_err(|e| format!("содержимое кода: {e}"))?;

        Ok(snapshot.content)
    })
}
