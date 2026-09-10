use std::fmt;

// ── Ошибки сервиса ────────────────────────────────

#[derive(Debug)]
pub enum CodeServiceError {
    NotFound(String),
    Validation(String),
    Runtime(String),
    Internal(String),
}

impl fmt::Display for CodeServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Runtime(msg) => write!(f, "Runtime error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for CodeServiceError {}
