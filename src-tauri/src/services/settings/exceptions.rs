use std::fmt;

use super::schemas::SchemaError;

#[derive(Debug, Clone)]
pub struct InvalidSettingError {
    pub message: String,
}

impl fmt::Display for InvalidSettingError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid setting: {}", self.message)
    }
}

#[derive(Debug)]
pub enum SettingsServiceError {
    NotFound(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for SettingsServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Settings item not found: {}", msg),
            Self::Validation(msg) => write!(f, "Settings validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Settings internal error: {}", msg),
        }
    }
}

impl std::error::Error for SettingsServiceError {}

impl From<InvalidSettingError> for SettingsServiceError {
    fn from(e: InvalidSettingError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<SchemaError> for SettingsServiceError {
    fn from(e: SchemaError) -> Self {
        Self::Validation(e.message)
    }
}
