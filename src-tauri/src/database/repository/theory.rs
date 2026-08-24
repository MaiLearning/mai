use async_trait::async_trait;

use super::RepoResult;
use crate::plugins::theory::service::data::TheoryContentData;

#[async_trait]
pub trait TheoryRepository: Send + Sync {
    async fn get(&self, resource_id: &str) -> RepoResult<TheoryContentData>;
    async fn upsert(&self, data: TheoryContentData) -> RepoResult<TheoryContentData>;
    async fn delete(&self, resource_id: &str) -> RepoResult<TheoryContentData>;
}
