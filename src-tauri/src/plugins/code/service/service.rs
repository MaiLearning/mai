use std::path::Path;
use std::sync::Arc;

use crate::database::repository::code::CodeRepository;
use crate::database::repository::RepoError;
use crate::services::settings::SettingsService;

use super::data::{CodeContentData, CodeRowData, CodeRunResultData};
use super::exceptions::CodeServiceError;
use super::{executor, rules};

/// Пункт пользовательских настроек с путями рантаймов — зеркало определения
/// `codeSettingsDefinition` (`@mai-plugin/code`) на фронтенде.
const SETTINGS_DOMAIN: &str = "plugin";
const SETTINGS_ITEM_ID: &str = "internal-code";

/// Ключ поля настроек с путём интерпретатора для языка (зеркало Zod-схемы).
fn runtime_field(language: &str) -> &'static str {
    match language {
        "javascript" => "javascriptPath",
        _ => "pythonPath",
    }
}

/// Путь интерпретатора из документа настроек: отсутствие документа/поля или
/// пустая строка (в т.ч. из пробелов) — рантайм не настроен.
fn runtime_path(settings: &serde_json::Value, language: &str) -> Option<String> {
    settings
        .get(runtime_field(language))?
        .get("value")?
        .as_str()
        .map(str::trim)
        .filter(|path| !path.is_empty())
        .map(str::to_string)
}

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
    settings: SettingsService,
}

impl CodeService {
    pub fn new(code_repo: Arc<dyn CodeRepository>, settings: SettingsService) -> Self {
        Self {
            code_repo,
            settings,
        }
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

    /// Путь рантайма из пункта настроек `plugin/internal-code` с проверкой
    /// существования файла. Отсутствие пункта/поля или пустое значение — не настроен.
    async fn resolve_runtime(&self, language: &str) -> Result<String, CodeServiceError> {
        let not_configured =
            || CodeServiceError::Runtime(format!("Рантайм для языка '{}' не настроен", language));

        let document = self
            .settings
            .get(SETTINGS_DOMAIN, SETTINGS_ITEM_ID)
            .await
            .map_err(|e| {
                CodeServiceError::Internal(format!("Не удалось прочитать настройки Code: {}", e))
            })?;

        let path = document
            .as_ref()
            .and_then(|document| runtime_path(&document.settings, language))
            .ok_or_else(not_configured)?;

        if !Path::new(&path).exists() {
            return Err(CodeServiceError::Runtime(format!(
                "Файл рантайма для языка '{}' не найден: {}",
                language, path
            )));
        }

        Ok(path)
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::{runtime_field, runtime_path};

    #[test]
    fn runtime_field_matches_settings_schema() {
        assert_eq!(runtime_field("python"), "pythonPath");
        assert_eq!(runtime_field("javascript"), "javascriptPath");
    }

    #[test]
    fn runtime_path_reads_trimmed_value() {
        let settings = json!({
            "pythonPath": { "type": "text_input", "value": "  /usr/bin/python3  " },
            "javascriptPath": { "type": "text_input", "value": "/usr/bin/node" },
        });

        assert_eq!(
            runtime_path(&settings, "python"),
            Some("/usr/bin/python3".to_string())
        );
        assert_eq!(
            runtime_path(&settings, "javascript"),
            Some("/usr/bin/node".to_string())
        );
    }

    #[test]
    fn runtime_path_treats_missing_and_blank_as_unset() {
        let blank = json!({ "pythonPath": { "type": "text_input", "value": "   " } });
        assert_eq!(runtime_path(&blank, "python"), None);

        let missing_field = json!({ "javascriptPath": { "type": "text_input", "value": "" } });
        assert_eq!(runtime_path(&missing_field, "python"), None);

        let missing_value = json!({ "pythonPath": { "type": "text_input" } });
        assert_eq!(runtime_path(&missing_value, "python"), None);

        assert_eq!(runtime_path(&json!({}), "javascript"), None);
    }
}
