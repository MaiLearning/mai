use std::fmt;

#[derive(Debug, Clone)]
pub struct InvalidPluginIdError {
    pub message: String,
}

impl fmt::Display for InvalidPluginIdError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid plugin id: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidPluginNameError {
    pub message: String,
}

impl fmt::Display for InvalidPluginNameError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid plugin name: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidPluginVersionError {
    pub message: String,
}

impl fmt::Display for InvalidPluginVersionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid plugin version: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidManifestError {
    pub message: String,
}

impl fmt::Display for InvalidManifestError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid manifest: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidSdkVersionError {
    pub message: String,
}

impl fmt::Display for InvalidSdkVersionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid SDK version: {}", self.message)
    }
}

#[derive(Debug)]
pub enum PluginServiceError {
    NotFound(String),
    AlreadyExists(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for PluginServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Plugin not found: {}", msg),
            Self::AlreadyExists(msg) => write!(f, "Plugin already exists: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

impl std::error::Error for PluginServiceError {}

impl From<InvalidPluginIdError> for PluginServiceError {
    fn from(e: InvalidPluginIdError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidPluginNameError> for PluginServiceError {
    fn from(e: InvalidPluginNameError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidPluginVersionError> for PluginServiceError {
    fn from(e: InvalidPluginVersionError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidManifestError> for PluginServiceError {
    fn from(e: InvalidManifestError) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidSdkVersionError> for PluginServiceError {
    fn from(e: InvalidSdkVersionError) -> Self {
        Self::Validation(e.message)
    }
}
