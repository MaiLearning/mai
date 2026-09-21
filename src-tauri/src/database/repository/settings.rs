use async_trait::async_trait;

use super::RepoResult;
use crate::services::settings::SettingsItemData;

#[async_trait]
pub trait SettingsRepository: Send + Sync {
    async fn get(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData>;
    async fn set(&self, data: SettingsItemData) -> RepoResult<SettingsItemData>;
    async fn delete(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData>;
}
