use async_trait::async_trait;

use crate::database::repository::RepoResult;
use crate::services::structure::DirectoryData;

#[async_trait]
pub trait DirectoryRepository: Send + Sync {
    async fn create(&self, id: &str, course_id: &str, name: &str) -> RepoResult<()>;
    async fn get(&self, id: &str) -> RepoResult<DirectoryData>;
    async fn get_by_course(&self, course_id: &str) -> RepoResult<Vec<DirectoryData>>;
    async fn update_name(&self, id: &str, name: &str) -> RepoResult<()>;
    async fn delete(&self, id: &str) -> RepoResult<()>;
}
