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
mod trim;

pub use registry::find;
pub use snapshot::SnapshotView;
pub use theory::TheoryView;
pub use trim::{TrimPaths, Trimmed};

use crate::server::state::AppState;
use serde_json::Value;
use std::future::Future;
use std::pin::Pin;

/// Почему чтение содержимого не удалось.
///
/// Разные причины требуют разного поведения вызывающего, поэтому строкой
/// ошибки не обойтись: «нет содержимого» — это норма (агент так узнаёт, что
/// ресурс пуст), а «ошибка хранилища» — повод напечатать id ресурса, чтобы агент
/// сузил выборку. Тип, не выставленный наружу, разбирается отдельно — в
/// [`crate::server::mcp::content::find`].
#[derive(Debug)]
pub enum FetchError {
    /// Контента ещё нет — хранилище прочитано, строки нет.
    NoContent,
    /// Хранилище типа ответило ошибкой.
    Read(String),
}

impl std::fmt::Display for FetchError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoContent => write!(f, "нет сохранённого содержимого"),
            Self::Read(msg) => write!(f, "{msg}"),
        }
    }
}

/// Future чтения хранилища типа. Бокснутый: трейт должен оставаться объектным
/// (`&'static dyn ContentView`), а у каждого типа своё асинхронное хранилище.
pub type Fetch<'a> = Pin<Box<dyn Future<Output = Result<Value, FetchError>> + Send + 'a>>;

/// Проекция одного типа ресурса.
pub trait ContentView: Send + Sync {
    /// Типы ресурсов, которые обслуживает проекция.
    fn type_keys(&self) -> &'static [&'static str];

    /// Человеческое имя типа — для шапки ответа и ошибок.
    fn label(&self) -> &'static str;

    /// Сырое содержимое из хранилища типа.
    ///
    /// Слой read-only: реализация обязана только читать. Материализация
    /// содержимого на чтении ломает инвариант — вызывающий обязан брать
    /// строгие методы сервисов.
    fn fetch<'a>(&'a self, state: &'a AppState, resource_id: &'a str) -> Fetch<'a>;

    /// Читаемый текст содержимого.
    fn to_text(&self, raw: &Value) -> String;

    /// Структурная обрезка содержимого под бюджет ответа.
    ///
    /// Обрезать JSON посередине нельзя — агент получает нечитаемый хвост,
    /// поэтому большие документы урезаются по границе элемента: у теории это
    /// блоки документа, у задач и кода — элементы коллекции, а карты,
    /// ключованные по id, фильтруются до оставшихся элементов.
    ///
    /// `None` — обрезать нечего (структура не по-elementная или документ
    /// уложился в бюджет): вызывающий отдаёт ответ как есть либо отказывает.
    fn trim(&self, raw: &Value, budget: usize) -> Option<Trimmed>;
}

/// Известные агенту типы содержимого: для ошибок и подсказок.
pub fn known_type_keys() -> Vec<&'static str> {
    registry::all()
        .iter()
        .flat_map(|view| view.type_keys().iter().copied())
        .collect()
}
