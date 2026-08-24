use serde::Deserialize;
use serde::Serialize;

/// Запись KV-хранилища уровня приложения.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KvEntryData {
    pub key: String,
    pub value: serde_json::Value,
    pub created_at: i64,
    pub updated_at: i64,
}
