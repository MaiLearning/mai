use std::sync::Arc;

use crate::database::repository::theory::TheoryRepository;
use crate::database::repository::RepoError;

use super::data::TheoryContentData;
use super::exceptions::TheoryServiceError;

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> TheoryServiceError {
    match e {
        RepoError::NotFound(msg) => TheoryServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            TheoryServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            TheoryServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

fn empty_lexical_state() -> serde_json::Value {
    serde_json::json!({
        "root": {
            "children": [{
                "children": [],
                "direction": null,
                "format": "",
                "indent": 0,
                "type": "paragraph",
                "version": 1
            }],
            "direction": null,
            "format": "",
            "indent": 0,
            "type": "root",
            "version": 1
        }
    })
}

pub struct TheoryService {
    theory_repo: Arc<dyn TheoryRepository>,
}

impl TheoryService {
    pub fn new(theory_repo: Arc<dyn TheoryRepository>) -> Self {
        Self { theory_repo }
    }

    pub async fn get(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        match self.theory_repo.get(resource_id).await {
            Ok(data) => Ok(data),
            Err(RepoError::NotFound(_)) => {
                let now = now_millis();
                let data = TheoryContentData {
                    resource_id: resource_id.to_string(),
                    content: empty_lexical_state(),
                    created_at: now,
                    updated_at: now,
                };
                self.theory_repo
                    .upsert(data)
                    .await
                    .map_err(|e| map_repo_error(e, "create theory content"))
            }
            Err(e) => Err(map_repo_error(e, "get theory content")),
        }
    }

    pub async fn save(
        &self,
        resource_id: &str,
        content: serde_json::Value,
    ) -> Result<TheoryContentData, TheoryServiceError> {
        let now = now_millis();
        let data = TheoryContentData {
            resource_id: resource_id.to_string(),
            content,
            created_at: now,
            updated_at: now,
        };

        self.theory_repo
            .upsert(data)
            .await
            .map_err(|e| map_repo_error(e, "save theory content"))
    }

    pub async fn clear(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        self.save(resource_id, empty_lexical_state()).await
    }

    pub async fn delete(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        self.theory_repo
            .delete(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "delete theory content"))
    }
}
