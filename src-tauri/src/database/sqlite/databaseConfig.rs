use std::fmt;
use std::path::{Path, PathBuf};

use serde::Deserialize;
use serde_json::Value;

use super::settings::DatabaseConfig;

#[derive(Debug, PartialEq, Eq)]
pub struct DatabaseConfigError(String);

impl DatabaseConfigError {
    fn new(message: impl Into<String>) -> Self {
        Self(message.into())
    }
}

impl fmt::Display for DatabaseConfigError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(&self.0)
    }
}

impl std::error::Error for DatabaseConfigError {}

#[derive(Deserialize)]
struct DatabaseConfigDto {
    path: String,
    max_connections: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum DatabaseProfile {
    Development,
    Production,
    Release,
}

impl DatabaseProfile {
    fn current() -> Self {
        if cfg!(debug_assertions) {
            Self::Development
        } else {
            Self::Release
        }
    }

    fn from_name(name: &str) -> Option<Self> {
        match name {
            "development" => Some(Self::Development),
            "production" => Some(Self::Production),
            "release" => Some(Self::Release),
            _ => None,
        }
    }

    fn name(self) -> &'static str {
        match self {
            Self::Development => "development",
            Self::Production => "production",
            Self::Release => "release",
        }
    }

    fn pointer(self) -> &'static str {
        match self {
            Self::Development => "/mode/development/database",
            Self::Production => "/mode/production/database",
            Self::Release => "/mode/release/database",
        }
    }
}

pub fn from_mai_config(
    raw: &Value,
    app_data_dir: &Path,
) -> Result<DatabaseConfig, DatabaseConfigError> {
    let available = raw
        .pointer("/mode/available")
        .and_then(Value::as_array)
        .ok_or_else(|| DatabaseConfigError::new("mode.available: список режимов не найден"))?;
    if available.is_empty() {
        return Err(DatabaseConfigError::new(
            "mode.available: должен содержать хотя бы один режим",
        ));
    }

    for name in available {
        let name = name.as_str().ok_or_else(|| {
            DatabaseConfigError::new("mode.available: имя режима должно быть строкой")
        })?;
        let profile = DatabaseProfile::from_name(name).ok_or_else(|| {
            DatabaseConfigError::new(format!("mode.available: неизвестный режим `{name}`"))
        })?;
        from_mai_config_for_profile(raw, app_data_dir, profile)?;
    }

    from_mai_config_for_profile(raw, app_data_dir, DatabaseProfile::current())
}

fn from_mai_config_for_profile(
    raw: &Value,
    app_data_dir: &Path,
    profile: DatabaseProfile,
) -> Result<DatabaseConfig, DatabaseConfigError> {
    let value = raw.pointer(profile.pointer()).ok_or_else(|| {
        DatabaseConfigError::new(format!(
            "mode.{}.database: объект не найден",
            profile.name()
        ))
    })?;
    let dto: DatabaseConfigDto = serde_json::from_value(value.clone()).map_err(|error| {
        DatabaseConfigError::new(format!("mode.{}.database: {error}", profile.name()))
    })?;

    if dto.path.is_empty() {
        return Err(DatabaseConfigError::new(format!(
            "mode.{}.database.path: путь не должен быть пустым",
            profile.name()
        )));
    }
    if dto.max_connections == 0 {
        return Err(DatabaseConfigError::new(format!(
            "mode.{}.database.max_connections: значение должно быть больше 0",
            profile.name()
        )));
    }

    let path = PathBuf::from(dto.path);
    let path = if path.is_absolute() {
        path
    } else {
        app_data_dir.join(path)
    };

    Ok(DatabaseConfig {
        path,
        max_connections: dto.max_connections,
    })
}

#[cfg(test)]
#[path = "databaseConfigTests.rs"]
mod tests;
