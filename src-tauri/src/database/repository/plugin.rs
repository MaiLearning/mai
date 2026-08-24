use async_trait::async_trait;

use super::RepoResult;
use crate::services::plugin::PluginData;

#[async_trait]
pub trait PluginRepository: Send + Sync {
    async fn all(&self) -> RepoResult<Vec<PluginData>>;
    async fn get(&self, id: &str) -> RepoResult<PluginData>;
    async fn create_external(&self, data: PluginData, sdk_version: &str) -> RepoResult<PluginData>;
    async fn create_internal(&self, data: PluginData) -> RepoResult<PluginData>;
    async fn delete(&self, id: &str) -> RepoResult<PluginData>;
    async fn set_enabled(&self, id: &str, enabled: bool) -> RepoResult<()>;
}
