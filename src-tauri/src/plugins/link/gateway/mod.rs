//! Gateway link-плагина.
//!
//! Стандарт раскладки: `manifest.rs` (константы + манифест — одинаковый
//! файл у всех плагинов), `args.rs` (типизированные аргументы методов),
//! `handlers.rs` (обработчики и маппинг ошибок). `registry.rs`/`dispatch.rs`
//! зовут только re-exports отсюда — имена внутренних файлов не протекают.
//!
//! Правило идентичности: владелец рёбер выводится из `caller` запроса,
//! а не из аргументов — подделать чужое владение нельзя. Отсутствие
//! caller'а трактуется как `"app"` — мутации будут отвергнуты.

pub mod args;
pub mod handlers;
pub mod manifest;

pub use handlers::{
    course_graph, create, delete, delete_by_source, list_backlinks, list_by_source, update,
};
pub use manifest::{
    manifest, METHOD_COURSE_GRAPH, METHOD_CREATE, METHOD_DELETE, METHOD_DELETE_BY_SOURCE,
    METHOD_LIST_BACKLINKS, METHOD_LIST_BY_SOURCE, METHOD_UPDATE, PLUGIN_ID,
};
