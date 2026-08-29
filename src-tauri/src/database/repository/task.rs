use async_trait::async_trait;

use super::RepoResult;
use crate::plugins::task::service::data::TaskContentData;

#[async_trait]
pub trait TaskRepository: Send + Sync {
    async fn get(&self, resource_id: &str) -> RepoResult<TaskContentData>;
    async fn upsert(&self, data: TaskContentData) -> RepoResult<TaskContentData>;
    async fn delete(&self, resource_id: &str) -> RepoResult<TaskContentData>;
}
