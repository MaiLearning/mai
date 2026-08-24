use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceTypeData {
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    pub plugin_id: Option<String>,
    pub supported_extensions: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceData {
    pub id: String,
    pub course_id: String,
    pub type_key: Option<String>,
    pub name: String,
    pub metadata: serde_json::Value,
    pub files: Vec<String>,
    pub created_at: i64,
    pub updated_at: i64,
}
