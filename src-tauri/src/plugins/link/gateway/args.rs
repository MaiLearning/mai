//! Типизированные аргументы gateway-методов link-плагина (wire — camelCase).

use serde::Deserialize;

use crate::plugins::link::service::data::LinkTargetData;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct CreateArgs {
    pub source_type: String,
    pub source_id: String,
    pub target: LinkTargetData,
    pub title: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct UpdateArgs {
    pub id: String,
    pub target: LinkTargetData,
    pub title: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct IdArgs {
    pub id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct SourceArgs {
    pub source_type: String,
    pub source_id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct BacklinksArgs {
    pub target: LinkTargetData,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(super) struct CourseGraphArgs {
    pub course_id: String,
}
