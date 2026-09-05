//! Сборка LinkService per-call: общий для IPC-команд и gateway-обработчиков.

use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::database::sqlite::repositories::link::SqliteLinkRepository;
use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::plugins::link::service::LinkService;
use crate::services::events::SharedChangePublisher;

/// Сервис собирается per-call: пул + скоуп-паблишер событий.
pub fn build_service(pool: &SqlitePool, publisher: SharedChangePublisher) -> LinkService {
    let link_repo = Arc::new(SqliteLinkRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let course_repo = Arc::new(SqliteCourseRepository::new(pool.clone()));
    let plugin_repo = Arc::new(SqlitePluginRepository::new(pool.clone()));
    LinkService::new(
        link_repo,
        resource_repo,
        course_repo,
        plugin_repo,
        publisher,
    )
}
