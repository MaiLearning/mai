use async_trait::async_trait;

use super::RepoResult;
use crate::services::kv::KvEntryData;

#[async_trait]
pub trait KvRepository: Send + Sync {
    async fn get(&self, key: &str) -> RepoResult<KvEntryData>;
    async fn set(&self, data: KvEntryData) -> RepoResult<KvEntryData>;
    async fn delete(&self, key: &str) -> RepoResult<KvEntryData>;
    async fn exists(&self, key: &str) -> RepoResult<bool>;
    async fn list_keys(&self, prefix: Option<&str>) -> RepoResult<Vec<String>>;
}
