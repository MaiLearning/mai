use async_trait::async_trait;

use super::RepoResult;
use crate::plugins::code::service::data::CodeRowData;

#[async_trait]
pub trait CodeRepository: Send + Sync {
    async fn get(&self, resource_id: &str) -> RepoResult<CodeRowData>;
    async fn upsert(&self, data: CodeRowData) -> RepoResult<CodeRowData>;
    async fn delete(&self, resource_id: &str) -> RepoResult<()>;
}
