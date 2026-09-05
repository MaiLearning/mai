//! Gateway task-плагина.
//!
//! Стандарт раскладки: `manifest.rs` (константы + манифест — одинаковый
//! файл у всех плагинов), `handlers.rs` (обработчики и маппинг ошибок).
//! `registry.rs`/`dispatch.rs` зовут только re-exports отсюда — имена
//! внутренних файлов не протекают.

pub mod handlers;
pub mod manifest;

pub use handlers::{attempts, snapshot};
pub use manifest::{manifest, METHOD_ATTEMPTS, METHOD_SNAPSHOT, PLUGIN_ID};
