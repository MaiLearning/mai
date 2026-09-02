use async_trait::async_trait;

use super::RepoResult;
use crate::services::resource::ResourceData;

#[async_trait]
pub trait ResourceRepository: Send + Sync {
    async fn all(&self) -> RepoResult<Vec<ResourceData>>;
    async fn get(&self, id: &str) -> RepoResult<ResourceData>;
    async fn create(&self, data: ResourceData) -> RepoResult<ResourceData>;
    async fn update(&self, data: ResourceData) -> RepoResult<ResourceData>;
    async fn update_name(&self, id: &str, name: &str) -> RepoResult<()>;
    async fn delete(&self, id: &str) -> RepoResult<ResourceData>;
}
