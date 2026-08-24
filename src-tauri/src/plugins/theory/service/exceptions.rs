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
pub enum TheoryServiceError {
    NotFound(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for TheoryServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for TheoryServiceError {}

impl From<InvalidResourceIdError> for TheoryServiceError {
    fn from(e: InvalidResourceIdError) -> Self {
        TheoryServiceError::Validation(e.message)
    }
}
