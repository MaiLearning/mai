use std::fmt;

#[derive(Debug, Clone)]
pub struct InvalidResourceTypeKeyError {
    pub message: String,
}

impl fmt::Display for InvalidResourceTypeKeyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource type key: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceTypeNameError {
    pub message: String,
}

impl fmt::Display for InvalidResourceTypeNameError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource type name: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceTypeDescriptionError {
    pub message: String,
}

impl fmt::Display for InvalidResourceTypeDescriptionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource type description: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceTypeExtensionError {
    pub message: String,
}

impl fmt::Display for InvalidResourceTypeExtensionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource type extension: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceIdError {
    pub message: String,
}

impl fmt::Display for InvalidResourceIdError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceCourseIdError {
    pub message: String,
}

impl fmt::Display for InvalidResourceCourseIdError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource course id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceNameError {
    pub message: String,
}

impl fmt::Display for InvalidResourceNameError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource name: {}", self.message)
    }
}

#[derive(Debug)]
pub enum ResourceServiceError {
    NotFound(String),
    AlreadyExists(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for ResourceServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::AlreadyExists(msg) => write!(f, "Already exists: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for ResourceServiceError {}

impl From<InvalidResourceTypeKeyError> for ResourceServiceError {
    fn from(e: InvalidResourceTypeKeyError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceTypeNameError> for ResourceServiceError {
    fn from(e: InvalidResourceTypeNameError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceTypeDescriptionError> for ResourceServiceError {
    fn from(e: InvalidResourceTypeDescriptionError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceTypeExtensionError> for ResourceServiceError {
    fn from(e: InvalidResourceTypeExtensionError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceIdError> for ResourceServiceError {
    fn from(e: InvalidResourceIdError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceCourseIdError> for ResourceServiceError {
    fn from(e: InvalidResourceCourseIdError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidResourceNameError> for ResourceServiceError {
    fn from(e: InvalidResourceNameError) -> Self {
        Self::Validation(e.message)
    }
}
