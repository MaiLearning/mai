//! Сборка TheoryService per-call: общий для IPC-команд и gateway-обработчиков.

use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::theory::SqliteTheoryRepository;
use crate::plugins::theory::service::TheoryService;

/// Сервис собирается per-call (theory-сервис событий не публикует — без паблишера).
pub fn build_service(pool: &SqlitePool) -> TheoryService {
    let theory_repo = Arc::new(SqliteTheoryRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    TheoryService::new(theory_repo, resource_repo)
}
