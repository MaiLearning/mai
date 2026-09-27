//! Проекции содержимого ресурса для агента.
//!
//! **Не путать с `resources/`**: там MCP-ресурсы (справка по URI), здесь —
//! проекции материала курса по `typeKey`.
//!
//! Зачем реестр, а не поле в инструменте: содержимое лежит в разных таблицах
//! и в разных форматах, а агент работает с единым интерфейсом. Тип ресурса
//! определяет, кто читает хранилище и как содержимое превращается в текст, а
//! инструмент `mai_get_content` только маршрутизирует. Добавление типа —
//! реализация `ContentView` плюс строка в `registry::all()`; сам инструмент
//! не меняется.

mod registry;
mod snapshot;
mod theory;

pub use registry::find;
pub use snapshot::SnapshotView;
pub use theory::TheoryView;

use crate::server::state::AppState;
use serde_json::Value;
use std::future::Future;
use std::pin::Pin;

/// Future чтения хранилища типа. Бокснутый: трейт должен оставаться объектным
/// (`&'static dyn ContentView`), а у каждого типа своё асинхронное хранилище.
pub type Fetch<'a> = Pin<Box<dyn Future<Output = Result<Value, String>> + Send + 'a>>;

/// Проекция одного типа ресурса.
pub trait ContentView: Send + Sync {
    /// Типы ресурсов, которые обслуживает проекция.
    fn type_keys(&self) -> &'static [&'static str];

    /// Человеческое имя типа — для шапки ответа и ошибок.
    fn label(&self) -> &'static str;

    /// Сырое содержимое из хранилища типа.
    ///
    /// Ошибка — текстом: у каждого типа своё хранилище и своя причина отказа
    /// («нет записи» против «нет такого ресурса»), а слой сообщений общий.
    fn fetch<'a>(&'a self, state: &'a AppState, resource_id: &'a str) -> Fetch<'a>;

    /// Читаемый текст содержимого.
    fn to_text(&self, raw: &Value) -> String;
}

/// Известные агенту типы содержимого: для ошибок и подсказок.
pub fn known_type_keys() -> Vec<&'static str> {
    registry::all()
        .iter()
        .flat_map(|view| view.type_keys().iter().copied())
        .collect()
}
