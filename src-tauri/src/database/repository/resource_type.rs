use async_trait::async_trait;

use super::RepoResult;
use crate::services::resource::ResourceTypeData;

#[async_trait]
pub trait ResourceTypeRepository: Send + Sync {
    async fn all(&self) -> RepoResult<Vec<ResourceTypeData>>;
    async fn get(&self, key: &str) -> RepoResult<ResourceTypeData>;
    async fn create(&self, data: ResourceTypeData) -> RepoResult<ResourceTypeData>;
    async fn update(&self, data: ResourceTypeData) -> RepoResult<ResourceTypeData>;
    async fn delete(&self, key: &str) -> RepoResult<ResourceTypeData>;
}
