// Доменные ошибки сущности Course.

use std::fmt;

// ---------------------------------------------------------------------------
// Базовые ошибки — нарушения бизнес-правил
// ---------------------------------------------------------------------------

#[derive(Debug, Clone)]
pub struct InvalidCourseNameException {
    pub message: String,
}

impl fmt::Display for InvalidCourseNameException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course name: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseDescriptionException {
    pub message: String,
}

impl fmt::Display for InvalidCourseDescriptionException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course description: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseIdentifierException {
    pub message: String,
}

impl fmt::Display for InvalidCourseIdentifierException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course identifier: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseTimelineException {
    pub message: String,
}

impl fmt::Display for InvalidCourseTimelineException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course timeline: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseTopicException {
    pub message: String,
}

impl fmt::Display for InvalidCourseTopicException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course topic: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseColorException {
    pub message: String,
}

impl fmt::Display for InvalidCourseColorException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course color: {}", self.message)
    }
}

#[derive(Debug, Clone)]
pub struct InvalidCourseStatusException {
    pub message: String,
}

impl fmt::Display for InvalidCourseStatusException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Invalid course status: {}", self.message)
    }
}

// ---------------------------------------------------------------------------
// Единая ошибка сервиса курсов (для возврата из use-case'ов в endpoint)
// ---------------------------------------------------------------------------

#[derive(Debug)]
pub enum CourseServiceError {
    NotFound(String),
    Forbidden(String),
    Validation(String),
    Internal(String),
}

impl fmt::Display for CourseServiceError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Forbidden(msg) => write!(f, "Forbidden: {}", msg),
            Self::Validation(msg) => write!(f, "Validation error: {}", msg),
            Self::Internal(msg) => write!(f, "Internal error: {}", msg),
        }
    }
}

// Автоматические конверсии из rule-исключений в CourseServiceError
impl From<InvalidCourseNameException> for CourseServiceError {
    fn from(e: InvalidCourseNameException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseDescriptionException> for CourseServiceError {
    fn from(e: InvalidCourseDescriptionException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseIdentifierException> for CourseServiceError {
    fn from(e: InvalidCourseIdentifierException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseTimelineException> for CourseServiceError {
    fn from(e: InvalidCourseTimelineException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseTopicException> for CourseServiceError {
    fn from(e: InvalidCourseTopicException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseColorException> for CourseServiceError {
    fn from(e: InvalidCourseColorException) -> Self {
        Self::Validation(e.message)
    }
}

impl From<InvalidCourseStatusException> for CourseServiceError {
    fn from(e: InvalidCourseStatusException) -> Self {
        Self::Validation(e.message)
    }
}
