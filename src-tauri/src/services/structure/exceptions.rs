use std::fmt;

#[derive(Debug, Clone)]
pub struct InvalidStructureNodeIdException {
    pub message: String,
}

impl fmt::Display for InvalidStructureNodeIdException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid structure node id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidStructureResourceIdException {
    pub message: String,
}

impl fmt::Display for InvalidStructureResourceIdException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidDirectoryIdException {
    pub message: String,
}

impl fmt::Display for InvalidDirectoryIdException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid directory id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidDirectoryNameException {
    pub message: String,
}

impl fmt::Display for InvalidDirectoryNameException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid directory name: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidPositionException {
    pub message: String,
}

impl fmt::Display for InvalidPositionException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid position: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidParentException {
    pub message: String,
}

impl fmt::Display for InvalidParentException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid parent: {}", self.message)
    }
}

#[derive(Debug)]
pub enum StructureServiceError {
    NotFound(String),
    Forbidden(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for StructureServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl From<InvalidStructureNodeIdException> for StructureServiceError {
    fn from(e: InvalidStructureNodeIdException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidStructureResourceIdException> for StructureServiceError {
    fn from(e: InvalidStructureResourceIdException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidDirectoryIdException> for StructureServiceError {
    fn from(e: InvalidDirectoryIdException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidDirectoryNameException> for StructureServiceError {
    fn from(e: InvalidDirectoryNameException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidPositionException> for StructureServiceError {
    fn from(e: InvalidPositionException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidParentException> for StructureServiceError {
    fn from(e: InvalidParentException) -> Self {
        Self::Validation(e.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidResourceNameException {
    pub message: String,
}

impl fmt::Display for InvalidResourceNameException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid resource name: {}", self.message)
    }
}

impl From<InvalidResourceNameException> for StructureServiceError {
    fn from(e: InvalidResourceNameException) -> Self {
        Self::Validation(e.message)
    }
}
