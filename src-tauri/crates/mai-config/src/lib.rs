//! Единый конфиг проекта Mai (`mai.toml`): чтение и слежение.
//!
//! Крейт не знает о конкретной схеме конфигурации: он читает файл,
//! парсит TOML и отдаёт значение как `serde_json::Value`. Типизация
//! и валидация схемы — на фронтенде (`@mai/config`, zod).
//!
//! Каналы доступа: Tauri-команда `config_get` (первичное чтение)
//! и событие `config://changed` (изменения файла).

pub mod commands;
pub mod watcher;

use std::fmt;
use std::path::{Path, PathBuf};
use std::sync::{Arc, RwLock};

use serde_json::Value;

use watcher::ConfigWatcher;

/// Ошибка чтения или парсинга конфигурации.
#[derive(Debug)]
pub enum ConfigError {
    Io(std::io::Error),
    Parse(toml::de::Error),
    Json(serde_json::Error),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ConfigError::Io(error) => write!(f, "config read error: {error}"),
            ConfigError::Parse(error) => write!(f, "config parse error: {error}"),
            ConfigError::Json(error) => write!(f, "config serialize error: {error}"),
        }
    }
}

impl std::error::Error for ConfigError {}

/// Прочитать и распарсить TOML-файл в `serde_json::Value`.
pub fn parse_file(path: &Path) -> Result<Value, ConfigError> {
    let raw = std::fs::read_to_string(path).map_err(ConfigError::Io)?;
    let value: toml::Value = toml::from_str(&raw).map_err(ConfigError::Parse)?;
    serde_json::to_value(value).map_err(ConfigError::Json)
}

/// Состояние конфигурации приложения.
///
/// Держит текущее значение и умеет перечитывать файл; вызывающая сторона
/// управляет временем жизни и рассылкой изменений (`Arc`).
pub struct MaiConfig {
    path: PathBuf,
    current: RwLock<Value>,
}

impl MaiConfig {
    /// Загрузить конфиг из файла. Файл должен существовать и парситься.
    pub fn load(path: impl Into<PathBuf>) -> Result<Self, ConfigError> {
        let path = path.into();
        let current = parse_file(&path)?;
        Ok(Self {
            path,
            current: RwLock::new(current),
        })
    }

    /// Путь к файлу конфига.
    pub fn path(&self) -> &Path {
        &self.path
    }

    /// Текущее значение конфига.
    pub fn current(&self) -> Value {
        self.current.read().expect("config poisoned").clone()
    }

    /// Перечитать файл и вернуть новое значение.
    pub fn reload(&self) -> Result<Value, ConfigError> {
        let value = parse_file(&self.path)?;
        *self.current.write().expect("config poisoned") = value.clone();
        Ok(value)
    }

    /// Запустить слежение за файлом. `on_change` вызывается после успешного
    /// перечитывания конфига с новым значением.
    pub fn watch<F>(self: &Arc<Self>, on_change: F) -> Result<ConfigWatcher, watcher::WatchError>
    where
        F: Fn(&Value) + Send + 'static,
    {
        ConfigWatcher::spawn(Arc::clone(self), on_change)
    }
}
