use async_trait::async_trait;

use crate::database::repository::RepoResult;
use crate::services::course::CourseData;

#[async_trait]
pub trait CourseRepository: Send + Sync {
    async fn all_courses(&self) -> RepoResult<Vec<CourseData>>;
    async fn get_course(&self, id: &str) -> RepoResult<CourseData>;
    async fn create_course(&self, data: CourseData) -> RepoResult<CourseData>;
    async fn update_course(&self, data: CourseData) -> RepoResult<CourseData>;
    async fn delete_course(&self, id: &str) -> RepoResult<CourseData>;
}
