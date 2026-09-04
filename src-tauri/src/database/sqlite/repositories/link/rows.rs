//! Row-структура ребра и сборка wire-модели LinkData из колонок.

use sqlx::FromRow;

use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::link::service::data::{LinkData, LinkStatus, LinkTargetData};

/// Список колонок таблицы links (без префиксов — для плоских выборок).
pub const LINK_COLUMNS: &str = "id, source_type, source_id, target_kind, target_course_id, \
     target_resource_id, target_uri, owner_plugin_id, title, description, created_at, updated_at";

/// Строка таблицы links.
#[derive(FromRow)]
pub struct LinkRow {
    pub id: String,
    pub source_type: String,
    pub source_id: String,
    pub target_kind: String,
    pub target_course_id: Option<String>,
    pub target_resource_id: Option<String>,
    pub target_uri: Option<String>,
    pub owner_plugin_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl LinkRow {
    /// Сборка wire-модели; рассинхрон колонок цели (исключён CHECK-ами схемы) —
    /// ошибка данных. targetStatus — заглушка Ok, сервис пересчитывает его.
    pub fn into_data(self) -> RepoResult<LinkData> {
        let target = match self.target_kind.as_str() {
            "resource" => LinkTargetData::Resource {
                course_id: self
                    .target_course_id
                    .ok_or_else(|| corrupt_row("resource", "target_course_id"))?,
                resource_id: self
                    .target_resource_id
                    .ok_or_else(|| corrupt_row("resource", "target_resource_id"))?,
            },
            "course" => LinkTargetData::Course {
                course_id: self
                    .target_course_id
                    .ok_or_else(|| corrupt_row("course", "target_course_id"))?,
            },
            "uri" => LinkTargetData::Uri {
                uri: self
                    .target_uri
                    .ok_or_else(|| corrupt_row("uri", "target_uri"))?,
            },
            other => {
                return Err(corrupt_row(other, "target_kind"));
            }
        };

        Ok(LinkData {
            id: self.id,
            source_type: self.source_type,
            source_id: self.source_id,
            target,
            owner_plugin_id: self.owner_plugin_id,
            title: self.title,
            description: self.description,
            created_at: self.created_at,
            updated_at: self.updated_at,
            target_status: LinkStatus::Ok,
        })
    }
}

/// Сборка Vec<LinkData> из строк.
pub fn rows_to_data(rows: Vec<LinkRow>) -> RepoResult<Vec<LinkData>> {
    rows.into_iter().map(LinkRow::into_data).collect()
}

/// Разбор цели на колонки для INSERT/UPDATE.
pub fn target_columns(
    target: &LinkTargetData,
) -> (&'static str, Option<&str>, Option<&str>, Option<&str>) {
    match target {
        LinkTargetData::Resource {
            course_id,
            resource_id,
        } => ("resource", Some(course_id), Some(resource_id), None),
        LinkTargetData::Course { course_id } => ("course", Some(course_id), None, None),
        LinkTargetData::Uri { uri } => ("uri", None, None, Some(uri)),
    }
}

/// Нарушение согласованности колонок цели — данные повреждены.
fn corrupt_row(kind: &str, column: &str) -> RepoError {
    RepoError::Db(sqlx::Error::Configuration(
        format!(
            "Corrupted link row: target_kind '{}' is missing {}",
            kind, column
        )
        .into(),
    ))
}
