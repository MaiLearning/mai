//! Сборка CodeService per-call: общий для IPC-команд.

use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::repository::kv::KvRepository;
use crate::database::sqlite::repositories::code::SqliteCodeRepository;
use crate::database::sqlite::repositories::kv::SqliteKvRepository;
use crate::plugins::code::service::CodeService;

/// Сервис собирается per-call (code-сервис событий не публикует — без паблишера).
pub fn build_service(pool: &SqlitePool) -> CodeService {
    let code_repo = Arc::new(SqliteCodeRepository::new(pool.clone()));
    let kv_repo: Arc<dyn KvRepository> = Arc::new(SqliteKvRepository::new(pool.clone()));
    CodeService::new(code_repo, kv_repo)
}
