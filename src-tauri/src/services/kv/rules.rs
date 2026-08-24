use super::data::KvEntryData;
use super::exceptions::{InvalidKvKeyError, KvServiceError};

const MAX_KEY_LENGTH: usize = 256;
const MAX_VALUE_SIZE: usize = 1024 * 1024;

pub fn validate_key(key: &str) -> Result<String, InvalidKvKeyError> {
    let normalized = key.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidKvKeyError {
            message: "Key must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_KEY_LENGTH {
        return Err(InvalidKvKeyError {
            message: format!("Key must not exceed {} characters.", MAX_KEY_LENGTH),
        });
    }
    if !normalized
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-' | ':' | '/'))
    {
        return Err(InvalidKvKeyError {
            message: "Key must contain only [a-zA-Z0-9._:/-].".into(),
        });
    }
    Ok(normalized)
}

pub fn validate_value(data: &KvEntryData) -> Result<(), KvServiceError> {
    let serialized = serde_json::to_string(&data.value)
        .map_err(|e| KvServiceError::Internal(format!("Value serialization: {}", e)))?;
    if serialized.len() > MAX_VALUE_SIZE {
        return Err(KvServiceError::Validation(format!(
            "Serialized value must not exceed {} bytes.",
            MAX_VALUE_SIZE
        )));
    }
    Ok(())
}
