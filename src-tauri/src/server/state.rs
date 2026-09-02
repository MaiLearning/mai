//! Состояние HTTP-сервера (Axum).
//!
//! Собирает всё необходимое эндпоинтам в один тип: пул соединений БД,
//! пути приложения и пабликатор событий изменений (http-скоуп).

use sqlx::SqlitePool;

use crate::services::events::SharedChangePublisher;
use crate::utils::paths::AppPaths;

/// Состояние Axum-роутера, доступное всем HTTP-эндпоинтам.
#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
    pub app_paths: AppPaths,
    /// Пабликатор событий изменений для мутаций через HTTP.
    pub publisher: SharedChangePublisher,
}
