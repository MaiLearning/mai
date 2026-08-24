use std::fmt;

#[derive(Debug, Clone)]
pub struct InvalidKvKeyError {
    pub message: String,
}

impl fmt::Display for InvalidKvKeyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid KV key: {}", self.message)
    }
}

#[derive(Debug)]
pub enum KvServiceError {
    NotFound(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for KvServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "KV entry not found: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for KvServiceError {}

impl From<InvalidKvKeyError> for KvServiceError {
    fn from(e: InvalidKvKeyError) -> Self {
        Self::Validation(e.message)
    }
}
