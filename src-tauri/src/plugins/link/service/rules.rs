use super::data::LinkTargetData;
use super::exceptions::{
    InvalidLinkDescriptionError, InvalidLinkOwnerError, InvalidLinkSourceError,
    InvalidLinkTargetError, InvalidLinkTitleError, InvalidLinkUriError,
};

const MAX_ID_LENGTH: usize = 64;
const MAX_URI_LENGTH: usize = 2048;
const MAX_TITLE_LENGTH: usize = 200;
const MAX_DESCRIPTION_LENGTH: usize = 2000;

/// Допустимые виды источников ребра (колонка source_type).
pub const SOURCE_KINDS: [&str; 2] = ["resource", "course"];

/// Вид источника: 'resource' | 'course'.
pub fn validate_source_type(source_type: &str) -> Result<String, InvalidLinkSourceError> {
    let normalized = source_type.trim().to_string();
    if !SOURCE_KINDS.contains(&normalized.as_str()) {
        return Err(InvalidLinkSourceError {
            message: format!(
                "Source type must be one of {:?}, got '{}'.",
                SOURCE_KINDS, source_type
            ),
        });
    }
    Ok(normalized)
}

/// Идентификатор источника/курса: непустой, ограниченной длины.
pub fn validate_source_id(source_id: &str) -> Result<String, InvalidLinkSourceError> {
    let normalized = source_id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidLinkSourceError {
            message: "Source id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidLinkSourceError {
            message: format!("Source id must not exceed {} characters.", MAX_ID_LENGTH),
        });
    }
    Ok(normalized)
}

/// Согласованность цели: kind=resource → courseId + resourceId,
/// kind=course → courseId, kind=uri → валидный uri.
pub fn validate_target(target: &LinkTargetData) -> Result<LinkTargetData, InvalidLinkTargetError> {
    match target {
        LinkTargetData::Resource {
            course_id,
            resource_id,
        } => Ok(LinkTargetData::Resource {
            course_id: normalize_target_id(course_id)?,
            resource_id: normalize_target_id(resource_id)?,
        }),
        LinkTargetData::Course { course_id } => Ok(LinkTargetData::Course {
            course_id: normalize_target_id(course_id)?,
        }),
        LinkTargetData::Uri { uri } => Ok(LinkTargetData::Uri {
            uri: validate_uri(uri).map_err(|e| InvalidLinkTargetError { message: e.message })?,
        }),
    }
}

/// URI: непустой, ≤2048 символов, со схемой (регэксп ^[a-zA-Z][a-zA-Z0-9+.-]*:.+).
/// Проверка без крейта regex — схема разбирается вручную.
pub fn validate_uri(uri: &str) -> Result<String, InvalidLinkUriError> {
    let normalized = uri.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidLinkUriError {
            message: "Uri must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_URI_LENGTH {
        return Err(InvalidLinkUriError {
            message: format!("Uri must not exceed {} characters.", MAX_URI_LENGTH),
        });
    }

    let Some((scheme, rest)) = normalized.split_once(':') else {
        return Err(InvalidLinkUriError {
            message: format!("Uri '{}' must have a scheme (e.g. \"https://...\").", uri),
        });
    };
    let mut chars = scheme.chars();
    let valid_scheme = match chars.next() {
        Some(first) if first.is_ascii_alphabetic() => {
            chars.all(|c| c.is_ascii_alphanumeric() || matches!(c, '+' | '.' | '-'))
        }
        _ => false,
    };
    if !valid_scheme || rest.is_empty() {
        return Err(InvalidLinkUriError {
            message: format!("Uri '{}' must match ^[a-zA-Z][a-zA-Z0-9+.-]*:.+", uri),
        });
    }
    Ok(normalized)
}

/// Заголовок: пустая/пробельная строка → None; иначе ≤200 символов.
pub fn validate_title(title: Option<String>) -> Result<Option<String>, InvalidLinkTitleError> {
    match title {
        None => Ok(None),
        Some(value) => {
            let normalized = value.trim().to_string();
            if normalized.is_empty() {
                return Ok(None);
            }
            if normalized.len() > MAX_TITLE_LENGTH {
                return Err(InvalidLinkTitleError {
                    message: format!("Title must not exceed {} characters.", MAX_TITLE_LENGTH),
                });
            }
            Ok(Some(normalized))
        }
    }
}

/// Описание: пустая/пробельная строка → None; иначе ≤2000 символов.
pub fn validate_description(
    description: Option<String>,
) -> Result<Option<String>, InvalidLinkDescriptionError> {
    match description {
        None => Ok(None),
        Some(value) => {
            let normalized = value.trim().to_string();
            if normalized.is_empty() {
                return Ok(None);
            }
            if normalized.len() > MAX_DESCRIPTION_LENGTH {
                return Err(InvalidLinkDescriptionError {
                    message: format!(
                        "Description must not exceed {} characters.",
                        MAX_DESCRIPTION_LENGTH
                    ),
                });
            }
            Ok(Some(normalized))
        }
    }
}

/// Id владельца ребра: непустой, ограниченной длины.
pub fn validate_owner_plugin_id(owner_plugin_id: &str) -> Result<String, InvalidLinkOwnerError> {
    let normalized = owner_plugin_id.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidLinkOwnerError {
            message: "Owner plugin id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidLinkOwnerError {
            message: format!(
                "Owner plugin id must not exceed {} characters.",
                MAX_ID_LENGTH
            ),
        });
    }
    Ok(normalized)
}

/// Нормализация id цели: trim, непустой, ограниченной длины.
fn normalize_target_id(value: &str) -> Result<String, InvalidLinkTargetError> {
    let normalized = value.trim().to_string();
    if normalized.is_empty() {
        return Err(InvalidLinkTargetError {
            message: "Target id must not be empty.".into(),
        });
    }
    if normalized.len() > MAX_ID_LENGTH {
        return Err(InvalidLinkTargetError {
            message: format!("Target id must not exceed {} characters.", MAX_ID_LENGTH),
        });
    }
    Ok(normalized)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn uri_requires_valid_scheme() {
        assert!(validate_uri("https://example.com/x").is_ok());
        assert!(validate_uri("mai://course/c-1").is_ok());
        assert!(validate_uri("mailto:a+b.c-d@example.com").is_ok());

        assert!(validate_uri("example.com").is_err()); // нет схемы
        assert!(validate_uri("1https://x").is_err()); // схема не с буквы
        assert!(validate_uri("ht tp://x").is_err()); // плохой символ схемы
        assert!(validate_uri("https:").is_err()); // пустое тело
        assert!(validate_uri("  https://x  ").is_ok()); // trim
        assert!(validate_uri(&"a".repeat(2049)).is_err()); // лимит длины
    }

    #[test]
    fn target_validates_consistency() {
        let resource = LinkTargetData::Resource {
            course_id: " c-1 ".into(),
            resource_id: "r-1".into(),
        };
        match validate_target(&resource).unwrap() {
            LinkTargetData::Resource { course_id, .. } => assert_eq!(course_id, "c-1"),
            other => panic!("unexpected target: {:?}", other),
        }

        assert!(validate_target(&LinkTargetData::Resource {
            course_id: "  ".into(),
            resource_id: "r-1".into(),
        })
        .is_err());

        assert!(validate_target(&LinkTargetData::Uri {
            uri: "no-scheme".into(),
        })
        .is_err());
    }

    #[test]
    fn title_and_description_normalize_blank_to_none() {
        assert_eq!(validate_title(None).unwrap(), None);
        assert_eq!(validate_title(Some("  ".into())).unwrap(), None);
        assert_eq!(
            validate_title(Some(" Заголовок ".into())).unwrap(),
            Some("Заголовок".into())
        );
        assert!(validate_title(Some("x".repeat(201))).is_err());
        assert!(validate_description(Some("x".repeat(2001))).is_err());
    }
}
