use serde::{Deserialize, Serialize};

/// Пользовательская сложность задачи.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CustomDifficultyData {
    pub id: String,
    pub label: String,
    pub color: String,
}
