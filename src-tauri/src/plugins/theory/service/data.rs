use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct TheoryContentData {
    pub resource_id: String,
    pub content: serde_json::Value,
    pub created_at: i64,
    pub updated_at: i64,
}
