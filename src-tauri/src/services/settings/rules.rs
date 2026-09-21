use serde_json::Value;

use super::exceptions::{InvalidSettingError, SettingsServiceError};

pub const SYSTEM_DOMAIN: &str = "system";
pub const PLUGIN_DOMAIN: &str = "plugin";
pub const COURSE_DOMAIN: &str = "course";

pub const MAX_ITEM_ID_LENGTH: usize = 128;
pub const MAX_FIELD_KEY_LENGTH: usize = 64;
pub const MAX_FIELDS: usize = 100;
pub const MAX_DOCUMENT_SIZE: usize = 256 * 1024;
pub const DEFAULT_SCHEMA_VERSION: i64 = 1;

/// Домен настроек — одно из трёх глобальных делений (system/plugin/course).
pub fn validate_domain(domain: &str) -> Result<(), InvalidSettingError> {
    match domain {
        SYSTEM_DOMAIN | PLUGIN_DOMAIN | COURSE_DOMAIN => Ok(()),
        _ => Err(InvalidSettingError {
            message: format!("Unknown settings domain '{}'", domain),
        }),
    }
}

/// Идентификатор пункта: секция для system, pluginId для plugin, courseId для course.
pub fn validate_item_id(item_id: &str) -> Result<String, InvalidSettingError> {
    let normalized = item_id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidSettingError {
            message: "Item id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ITEM_ID_LENGTH {
        return Err(InvalidSettingError {
            message: format!("Item id must not exceed {} characters.", MAX_ITEM_ID_LENGTH),
        });
    }
    if !normalized
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-'))
    {
        return Err(InvalidSettingError {
            message: "Item id must contain only [a-zA-Z0-9._-].".into(),
        });
    }
    Ok(normalized)
}

/// Ключ отдельной настройки внутри документа.
pub fn validate_field_key(key: &str) -> Result<(), InvalidSettingError> {
    if key.is_empty() {
        return Err(InvalidSettingError {
            message: "Field key must not be empty.".into(),
        });
    }
    if key.len() > MAX_FIELD_KEY_LENGTH {
        return Err(InvalidSettingError {
            message: format!(
                "Field key must not exceed {} characters.",
                MAX_FIELD_KEY_LENGTH
            ),
        });
    }
    Ok(())
}

/// Ограничение размера сериализованного документа.
pub fn validate_document_size(document: &Value) -> Result<(), SettingsServiceError> {
    let serialized = serde_json::to_string(document)
        .map_err(|e| SettingsServiceError::Internal(format!("Document serialization: {}", e)))?;
    if serialized.len() > MAX_DOCUMENT_SIZE {
        return Err(SettingsServiceError::Validation(format!(
            "Settings document must not exceed {} bytes.",
            MAX_DOCUMENT_SIZE
        )));
    }
    Ok(())
}
