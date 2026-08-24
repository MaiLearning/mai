use std::path::Path;

/// Конфигурация подключения к SQLite.
#[derive(Debug, Clone)]
pub struct DatabaseConfig {
    /// Путь к файлу БД или SQLite URL.
    pub url: String,
    /// Максимальное количество соединений в пуле.
    pub max_connections: u32,
}

impl DatabaseConfig {
    /// Базовый конструктор.
    pub fn new(url: impl Into<String>) -> Self {
        Self {
            url: url.into(),
            max_connections: 5,
        }
    }

    /// Dev-режим: БД в `{app_data_dir}/.dev/mai_dev.db`.
    ///
    /// Изолирована от продакшен-БД, не попадает в сборку.
    pub fn for_dev(app_data_dir: &Path) -> Self {
        let db_path = app_data_dir.join(".dev").join("mai_dev.db");
        Self::new(db_path.to_string_lossy().as_ref())
    }

    /// Продакшен-режим: БД в `{app_data_dir}/storage/mai.db`.
    pub fn for_prod(app_data_dir: &Path) -> Self {
        let db_path = app_data_dir.join("storage").join("mai.db");
        Self::new(db_path.to_string_lossy().as_ref())
    }

    /// Тестовый режим: уникальная БД в `/tmp/`.
    pub fn for_test() -> Self {
        let db_path = format!("/tmp/mai_test_{}.db", uuid::Uuid::new_v4());
        Self {
            url: db_path,
            max_connections: 2,
        }
    }
}
