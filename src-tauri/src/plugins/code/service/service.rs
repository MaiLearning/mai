use std::path::Path;
use std::sync::Arc;

use crate::database::repository::code::CodeRepository;
use crate::database::repository::kv::KvRepository;
use crate::database::repository::RepoError;

use super::data::{CodeContentData, CodeRowData, CodeRunResultData};
use super::exceptions::CodeServiceError;
use super::{executor, rules};

/// KV-ключ с путями рантаймов: {"python": "<path>|null", "javascript": "<path>|null"}.
const RUNTIMES_KEY: &str = "code-plugin/runtimes";

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> CodeServiceError {
    match e {
        RepoError::NotFound(msg) => CodeServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            CodeServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            CodeServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

pub struct CodeService {
    code_repo: Arc<dyn CodeRepository>,
    kv_repo: Arc<dyn KvRepository>,
}

impl CodeService {
    pub fn new(code_repo: Arc<dyn CodeRepository>, kv_repo: Arc<dyn KvRepository>) -> Self {
        Self { code_repo, kv_repo }
    }

    /// Снапшот контента code-ресурса (корень создаётся при отсутствии).
    pub async fn snapshot(&self, resource_id: &str) -> Result<CodeContentData, CodeServiceError> {
        match self.code_repo.get(resource_id).await {
            Ok(row) => Ok(row.into()),
            Err(RepoError::NotFound(_)) => {
                let now = now_millis();
                let data = CodeRowData {
                    resource_id: resource_id.to_string(),
                    content: serde_json::json!({}),
                    created_at: now,
                    updated_at: now,
                };
                let saved = self
                    .code_repo
                    .upsert(data)
                    .await
                    .map_err(|e| map_repo_error(e, "create code content"))?;
                Ok(saved.into())
            }
            Err(e) => Err(map_repo_error(e, "get code content")),
        }
    }

    /// Обновление контента code-ресурса.
    pub async fn update_content(
        &self,
        resource_id: &str,
        content: serde_json::Value,
    ) -> Result<CodeContentData, CodeServiceError> {
        rules::validate_content(&content)?;

        let created_at = match self.code_repo.get(resource_id).await {
            Ok(row) => row.created_at,
            Err(RepoError::NotFound(_)) => now_millis(),
            Err(e) => return Err(map_repo_error(e, "get code content")),
        };

        let data = CodeRowData {
            resource_id: resource_id.to_string(),
            content,
            created_at,
            updated_at: now_millis(),
        };
        let saved = self
            .code_repo
            .upsert(data)
            .await
            .map_err(|e| map_repo_error(e, "save code content"))?;

        log::info!("Контент code-ресурса {} обновлён", resource_id);
        Ok(saved.into())
    }

    /// Исполнение кода на настроенном рантайме.
    pub async fn run(
        &self,
        language: &str,
        code: &str,
    ) -> Result<CodeRunResultData, CodeServiceError> {
        rules::validate_language(language)?;
        rules::validate_code(code)?;

        let runtime_path = self.resolve_runtime(language).await?;
        let result = executor::run(language, code, &runtime_path).await?;

        log::info!("Запуск кода ({}), {} мс", language, result.duration_ms);
        Ok(result)
    }

    /// Путь рантайма из KV `code-plugin/runtimes` с проверкой существования файла.
    async fn resolve_runtime(&self, language: &str) -> Result<String, CodeServiceError> {
        let not_configured =
            || CodeServiceError::Runtime(format!("Рантайм для языка '{}' не настроен", language));

        let entry = match self.kv_repo.get(RUNTIMES_KEY).await {
            Ok(entry) => entry,
            Err(RepoError::NotFound(_)) => return Err(not_configured()),
            Err(e) => return Err(map_repo_error(e, "get code runtimes")),
        };

        let path = entry
            .value
            .get(language)
            .and_then(|v| v.as_str())
            .filter(|s| !s.is_empty())
            .ok_or_else(not_configured)?;

        if !Path::new(path).exists() {
            return Err(CodeServiceError::Runtime(format!(
                "Файл рантайма для языка '{}' не найден: {}",
                language, path
            )));
        }

        Ok(path.to_string())
    }
}
