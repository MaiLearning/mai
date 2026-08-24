use super::data::PluginManifest;
use super::exceptions::{
    InvalidManifestError, InvalidPluginIdError, InvalidPluginNameError, InvalidPluginVersionError,
    InvalidSdkVersionError,
};

const MIN_NAME_LENGTH: usize = 2;
const MAX_NAME_LENGTH: usize = 120;
const MAX_ID_LENGTH: usize = 64;
const MAX_VERSION_LENGTH: usize = 32;

pub fn validate_plugin_id(id: &str) -> Result<String, InvalidPluginIdError> {
    let normalized = id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidPluginIdError {
            message: "Plugin id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidPluginIdError {
            message: format!("Plugin id must not exceed {} characters.", MAX_ID_LENGTH),
        });
    }
    Ok(normalized)
}

pub fn validate_plugin_name(name: &str) -> Result<String, InvalidPluginNameError> {
    let normalized = name.trim().to_string();
    if normalized.len() < MIN_NAME_LENGTH {
        return Err(InvalidPluginNameError {
            message: format!(
                "Plugin name must be at least {} characters long.",
                MIN_NAME_LENGTH
            ),
        });
    }
    if normalized.len() > MAX_NAME_LENGTH {
        return Err(InvalidPluginNameError {
            message: format!(
                "Plugin name must not exceed {} characters.",
                MAX_NAME_LENGTH
            ),
        });
    }
    Ok(normalized)
}

pub fn validate_version(version: &str) -> Result<String, InvalidPluginVersionError> {
    let normalized = version.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidPluginVersionError {
            message: "Plugin version must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_VERSION_LENGTH {
        return Err(InvalidPluginVersionError {
            message: format!(
                "Plugin version must not exceed {} characters.",
                MAX_VERSION_LENGTH
            ),
        });
    }
    Ok(normalized)
}

pub fn validate_manifest(manifest: &PluginManifest) -> Result<(), InvalidManifestError> {
    if manifest.main.trim().is_empty() {
        return Err(InvalidManifestError {
            message: "Manifest 'main' field must not be empty.".into(),
        });
    }
    Ok(())
}

pub fn validate_sdk_version(version: &str) -> Result<(), InvalidSdkVersionError> {
    let normalized = version.trim();
    if normalized.is_empty() {
        return Err(InvalidSdkVersionError {
            message: "SDK version must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_VERSION_LENGTH {
        return Err(InvalidSdkVersionError {
            message: format!(
                "SDK version must not exceed {} characters.",
                MAX_VERSION_LENGTH
            ),
        });
    }
    Ok(())
}
