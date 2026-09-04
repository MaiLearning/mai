use std::fmt;

use crate::database::repository::RepoError;

// ── Ошибки валидации ──────────────────────────────

#[derive(Debug, Clone)]
pub struct InvalidLinkSourceError {
    pub message: String,
}

impl fmt::Display for InvalidLinkSourceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link source: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidLinkTargetError {
    pub message: String,
}

impl fmt::Display for InvalidLinkTargetError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link target: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidLinkUriError {
    pub message: String,
}

impl fmt::Display for InvalidLinkUriError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link uri: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidLinkTitleError {
    pub message: String,
}

impl fmt::Display for InvalidLinkTitleError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link title: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidLinkDescriptionError {
    pub message: String,
}

impl fmt::Display for InvalidLinkDescriptionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link description: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidLinkOwnerError {
    pub message: String,
}

impl fmt::Display for InvalidLinkOwnerError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid link owner plugin id: {}", self.message)
    }
}

// ── Ошибки сервиса ────────────────────────────────

#[derive(Debug)]
pub enum LinkServiceError {
    NotFound(String),
    Validation(String),
    Forbidden(String),
    Internal(String),
}

impl fmt::Display for LinkServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for LinkServiceError {}

impl From<RepoError> for LinkServiceError {
    fn from(e: RepoError) -> Self {
        match e {
            RepoError::NotFound(msg) => LinkServiceError::NotFound(msg),
            RepoError::Conflict(msg) => LinkServiceError::Internal(format!("Conflict: {}", msg)),
            RepoError::Db(msg) => LinkServiceError::Internal(format!("DB error: {}", msg)),
        }
    }
}

impl From<InvalidLinkSourceError> for LinkServiceError {
    fn from(e: InvalidLinkSourceError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}

impl From<InvalidLinkTargetError> for LinkServiceError {
    fn from(e: InvalidLinkTargetError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}

impl From<InvalidLinkUriError> for LinkServiceError {
    fn from(e: InvalidLinkUriError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}

impl From<InvalidLinkTitleError> for LinkServiceError {
    fn from(e: InvalidLinkTitleError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}

impl From<InvalidLinkDescriptionError> for LinkServiceError {
    fn from(e: InvalidLinkDescriptionError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}

impl From<InvalidLinkOwnerError> for LinkServiceError {
    fn from(e: InvalidLinkOwnerError) -> Self {
        LinkServiceError::Validation(e.message)
    }
}
