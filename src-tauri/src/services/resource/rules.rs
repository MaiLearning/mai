use super::exceptions::{
    InvalidResourceCourseIdError, InvalidResourceIdError, InvalidResourceNameError,
    InvalidResourceTypeDescriptionError, InvalidResourceTypeExtensionError,
    InvalidResourceTypeKeyError, InvalidResourceTypeNameError,
};

const MIN_NAME_LENGTH: usize = 2;
const MAX_NAME_LENGTH: usize = 120;
const MAX_ID_LENGTH: usize = 64;
const MAX_DESCRIPTION_LENGTH: usize = 1000;
const MAX_RESOURCE_NAME_LENGTH: usize = 200;

pub fn validate_resource_type_key(key: &str) -> Result<String, InvalidResourceTypeKeyError> {
    let normalized = key.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidResourceTypeKeyError {
            message: "Resource type key must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidResourceTypeKeyError {
            message: format!(
                "Resource type key must not exceed {} characters.",
                MAX_ID_LENGTH
            ),
        });
    }
    Ok(normalized)
}

pub fn validate_resource_type_name(name: &str) -> Result<String, InvalidResourceTypeNameError> {
    let normalized = name.trim().to_string();
    if normalized.len() < MIN_NAME_LENGTH {
        return Err(InvalidResourceTypeNameError {
            message: format!(
                "Resource type name must be at least {} characters long.",
                MIN_NAME_LENGTH
            ),
        });
    }
    if normalized.len() > MAX_NAME_LENGTH {
        return Err(InvalidResourceTypeNameError {
            message: format!(
                "Resource type name must not exceed {} characters.",
                MAX_NAME_LENGTH
            ),
        });
    }
    Ok(normalized)
}

pub fn validate_resource_type_description(
    description: &str,
) -> Result<String, InvalidResourceTypeDescriptionError> {
    let normalized = description.trim().to_string();
    if normalized.len() > MAX_DESCRIPTION_LENGTH {
        return Err(InvalidResourceTypeDescriptionError {
            message: format!(
                "Resource type description must not exceed {} characters.",
                MAX_DESCRIPTION_LENGTH
            ),
        });
    }
    Ok(normalized)
}

pub fn validate_resource_type_extensions(
    extensions: &[String],
) -> Result<(), InvalidResourceTypeExtensionError> {
    for ext in extensions {
        let trimmed = ext.trim();
        if trimmed.is_empty() {
            return Err(InvalidResourceTypeExtensionError {
                message: "Extension must not be empty.".into(),
            });
        }
        if !trimmed.starts_with('.') {
            return Err(InvalidResourceTypeExtensionError {
                message: format!(
                    "Extension '{}' must start with a dot (e.g. \".md\").",
                    trimmed
                ),
            });
        }
    }
    Ok(())
}

pub fn validate_resource_id(id: &str) -> Result<String, InvalidResourceIdError> {
    let normalized = id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidResourceIdError {
            message: "Resource id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidResourceIdError {
            message: format!("Resource id must not exceed {} characters.", MAX_ID_LENGTH),
        });
    }
    Ok(normalized)
}

pub fn validate_resource_course_id(
    course_id: &str,
) -> Result<String, InvalidResourceCourseIdError> {
    let normalized = course_id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidResourceCourseIdError {
            message: "Resource course id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidResourceCourseIdError {
            message: format!("Resource id must not exceed {} characters.", MAX_ID_LENGTH),
        });
    }
    Ok(normalized)
}

pub fn validate_resource_name(name: &str) -> Result<String, InvalidResourceNameError> {
    let normalized = name.trim().to_string();
    if normalized.len() < MIN_NAME_LENGTH {
        return Err(InvalidResourceNameError {
            message: format!(
                "Resource name must be at least {} characters long.",
                MIN_NAME_LENGTH
            ),
        });
    }
    if normalized.len() > MAX_RESOURCE_NAME_LENGTH {
        return Err(InvalidResourceNameError {
            message: format!(
                "Resource name must not exceed {} characters.",
                MAX_RESOURCE_NAME_LENGTH
            ),
        });
    }
    Ok(normalized)
}
