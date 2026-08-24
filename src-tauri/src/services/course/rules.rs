// Доменные правила и валидаторы для Course.
// Аналог CourseRules из platform/lib/entities/course/rules.dart.

use super::exceptions::{
    InvalidCourseColorException, InvalidCourseDescriptionException,
    InvalidCourseIdentifierException, InvalidCourseNameException, InvalidCourseStatusException,
    InvalidCourseTimelineException, InvalidCourseTopicException,
};

/// Статус по умолчанию для нового курса.
pub const DEFAULT_COURSE_STATUS: &str = "draft";
/// Допустимые значения статуса курса.
pub const COURSE_STATUSES: [&str; 3] = ["draft", "in_progress", "completed"];

pub struct CourseRules;

impl CourseRules {
    pub const MIN_NAME_LENGTH: usize = 3;
    pub const MAX_NAME_LENGTH: usize = 120;
    pub const MAX_DESCRIPTION_LENGTH: usize = 2000;
    pub const MAX_TOPIC_LENGTH: usize = 80;

    /// Проверяет и нормализует имя курса.
    pub fn validate_course_name(name: &str) -> Result<String, InvalidCourseNameException> {
        let normalized = name.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidCourseNameException {
                message: "Course name must not be empty.".into(),
            });
        }
        if normalized.len() < Self::MIN_NAME_LENGTH {
            return Err(InvalidCourseNameException {
                message: format!(
                    "Course name must be at least {} characters long.",
                    Self::MIN_NAME_LENGTH
                ),
            });
        }
        if normalized.len() > Self::MAX_NAME_LENGTH {
            return Err(InvalidCourseNameException {
                message: format!(
                    "Course name must not exceed {} characters.",
                    Self::MAX_NAME_LENGTH
                ),
            });
        }
        Ok(normalized)
    }

    /// Проверяет и нормализует описание курса.
    pub fn validate_course_description(
        description: Option<&str>,
    ) -> Result<Option<String>, InvalidCourseDescriptionException> {
        match description {
            None => Ok(None),
            Some(d) => {
                let normalized = d.trim().to_string();
                if normalized.is_empty() {
                    return Ok(None);
                }
                if normalized.len() > Self::MAX_DESCRIPTION_LENGTH {
                    return Err(InvalidCourseDescriptionException {
                        message: format!(
                            "Course description must not exceed {} characters.",
                            Self::MAX_DESCRIPTION_LENGTH
                        ),
                    });
                }
                Ok(Some(normalized))
            }
        }
    }

    /// Проверяет и нормализует идентификатор курса.
    pub fn validate_course_id(id: &str) -> Result<String, InvalidCourseIdentifierException> {
        let normalized = id.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidCourseIdentifierException {
                message: "Course id must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    /// Проверяет корректность временных меток курса.
    pub fn validate_course_timeline(
        created_at: i64,
        updated_at: i64,
    ) -> Result<(), InvalidCourseTimelineException> {
        if updated_at < created_at {
            return Err(InvalidCourseTimelineException {
                message: "updated_at cannot be earlier than created_at.".into(),
            });
        }
        Ok(())
    }

    /// Проверяет и нормализует тему курса (пустая/пробельная → None).
    pub fn validate_course_topic(
        topic: Option<&str>,
    ) -> Result<Option<String>, InvalidCourseTopicException> {
        match topic {
            None => Ok(None),
            Some(t) => {
                let normalized = t.trim().to_string();
                if normalized.is_empty() {
                    return Ok(None);
                }
                if normalized.len() > Self::MAX_TOPIC_LENGTH {
                    return Err(InvalidCourseTopicException {
                        message: format!(
                            "Course topic must not exceed {} characters.",
                            Self::MAX_TOPIC_LENGTH
                        ),
                    });
                }
                Ok(Some(normalized))
            }
        }
    }

    /// Проверяет и нормализует цвет карточки (hex-формат `#RRGGBB`).
    pub fn validate_course_color(
        color: Option<&str>,
    ) -> Result<Option<String>, InvalidCourseColorException> {
        const HEX_DIGITS: &str = "0123456789abcdefABCDEF";
        match color {
            None => Ok(None),
            Some(c) => {
                let normalized = c.trim().to_string();
                if normalized.is_empty() {
                    return Ok(None);
                }
                let valid = normalized.len() == 7
                    && normalized.starts_with('#')
                    && normalized[1..].chars().all(|ch| HEX_DIGITS.contains(ch));
                if !valid {
                    return Err(InvalidCourseColorException {
                        message: "Course color must be in #RRGGBB format.".into(),
                    });
                }
                Ok(Some(normalized.to_lowercase()))
            }
        }
    }

    /// Проверяет статус курса (draft | in_progress | completed).
    pub fn validate_course_status(status: &str) -> Result<String, InvalidCourseStatusException> {
        let normalized = status.trim().to_lowercase();
        if COURSE_STATUSES.contains(&normalized.as_str()) {
            Ok(normalized)
        } else {
            Err(InvalidCourseStatusException {
                message: format!(
                    "Course status must be one of: {}.",
                    COURSE_STATUSES.join(", ")
                ),
            })
        }
    }
}
