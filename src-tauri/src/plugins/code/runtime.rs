//! Сборка CodeService per-call: общий для IPC-команд.

use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::sqlite::repositories::code::SqliteCodeRepository;
use crate::database::sqlite::repositories::settings::SqliteSettingsRepository;
use crate::plugins::code::service::CodeService;
use crate::services::settings::SettingsService;

/// Сервис собирается per-call (code-сервис событий не публикует — без паблишера).
/// Пути интерпретаторов читаются из пользовательских настроек `plugin/internal-code`.
pub fn build_service(pool: &SqlitePool) -> CodeService {
    let code_repo = Arc::new(SqliteCodeRepository::new(pool.clone()));
    let settings = SettingsService::new(Arc::new(SqliteSettingsRepository::new(pool.clone())));
    CodeService::new(code_repo, settings)
}
