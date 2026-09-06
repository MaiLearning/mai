//! Gateway theory-плагина.
//!
//! Стандарт раскладки: `manifest.rs` (константы + манифест — одинаковый
//! файл у всех плагинов), `handlers.rs` (обработчики и маппинг ошибок).
//! v1 read-only: мутации контента через HTTP потребуют событийного
//! контракта (EntityKind + паблишер в сервисе).

pub mod handlers;
pub mod manifest;

pub use handlers::content;
pub use manifest::{manifest, routes, METHOD_CONTENT, PLUGIN_ID};
