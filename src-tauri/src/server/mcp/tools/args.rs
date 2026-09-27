//! Общие аргументы инструментов.
//!
//! Вынесены отдельно, потому что используются несколькими инструментами:
//! `courseId` нужен и карточке курса, и оглавлению, `resourceId` — карточке
//! ресурса, содержимому и поиску.

use schemars::JsonSchema;
use serde::Deserialize;

/// Идентификатор курса.
#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct CourseIdArgs {
    /// Идентификатор курса (UUID) — из `mai_list_courses`
    pub course_id: String,
}

/// Идентификатор ресурса.
#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceIdArgs {
    /// Идентификатор ресурса (UUID) — из `mai_course_outline`
    pub resource_id: String,
}
