use std::fmt;

// ── Ошибки валидации ──────────────────────────────

#[derive(Debug)]
pub struct InvalidResourceIdError {
    pub message: String,
}

impl fmt::Display for InvalidResourceIdError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource id: {}", self.message)
    }
}

// ── Ошибки сервиса ────────────────────────────────

#[derive(Debug)]
pub enum TaskServiceError {
    NotFound(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for TaskServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for TaskServiceError {}

impl From<InvalidResourceIdError> for TaskServiceError {
    fn from(e: InvalidResourceIdError) -> Self {
        TaskServiceError::Validation(e.message)
    }
}
