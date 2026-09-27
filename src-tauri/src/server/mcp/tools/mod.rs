//! Инструменты MCP: по файлу на инструмент.
//!
//! Файл инструмента содержит его аргументы (`Args` — из них строится JSON-схема
//! параметров, поэтому doc-комментарии на полях обязательны) и всю логику в
//! виде `run(state, args)`. Маршрут и описание инструмента объявляются в
//! `router.rs`: атрибут макроса принимает только строковый литерал.

pub mod args;

pub use args::CourseIdArgs;
pub mod course_outline;
pub mod get_content;
pub mod get_course;
pub mod get_resource;
pub mod list_courses;
pub mod list_plugins;
pub mod search;
