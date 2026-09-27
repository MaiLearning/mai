use std::sync::Arc;

use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::theory::TheoryRepository;
use crate::database::repository::RepoError;

use super::data::TheoryContentData;
use super::exceptions::TheoryServiceError;

/// Маркер «контент ещё ни разу не сохранялся» в `created_at`/`updated_at`
/// виртуальной записи (строки в БД нет): редактор получает валидный пустой
/// корень, но сама БД и staleness-проверки остаются нетронутыми.
pub(super) const NEVER_SAVED: i64 = 0;

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
    resource_repo: Arc<dyn ResourceRepository>,
}

impl TheoryService {
    pub fn new(
        theory_repo: Arc<dyn TheoryRepository>,
        resource_repo: Arc<dyn ResourceRepository>,
    ) -> Self {
        Self {
            theory_repo,
            resource_repo,
        }
    }

    /// Строгое чтение контента теории: отсутствующая запись — это `NotFound`,
    /// а не повод создать пустой корень. Путь read-only потребителей (MCP).
    pub async fn get(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        self.theory_repo
            .get(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "get theory content"))
    }

    /// Чтение с пустым Lexical-корнем по умолчанию: редактору и gateway нужен
    /// валидный документ, а не ошибка. Записи при этом нет — строка появится
    /// только на первом `save`, а отсутствие строки помечается `NEVER_SAVED`.
    /// Несуществующий ресурс — `NotFound`: иначе опечатка в id выглядела бы
    /// «успехом» с пустым контентом.
    pub async fn get_or_default(
        &self,
        resource_id: &str,
    ) -> Result<TheoryContentData, TheoryServiceError> {
        match self.theory_repo.get(resource_id).await {
            Ok(data) => Ok(data),
            Err(RepoError::NotFound(_)) => {
                self.ensure_resource_exists(resource_id).await?;

                Ok(TheoryContentData {
                    resource_id: resource_id.to_string(),
                    content: empty_lexical_state(),
                    created_at: NEVER_SAVED,
                    updated_at: NEVER_SAVED,
                })
            }
            Err(e) => Err(map_repo_error(e, "get theory content")),
        }
    }

    /// Сохранение контента — единственная точка появления строки в БД.
    /// `created_at` существующей записи сохраняется (upsert его не обновляет,
    /// поэтому во входных данных не должно быть «переехавшего» времени).
    pub async fn save(
        &self,
        resource_id: &str,
        content: serde_json::Value,
    ) -> Result<TheoryContentData, TheoryServiceError> {
        let created_at = match self.theory_repo.get(resource_id).await {
            Ok(existing) => existing.created_at,
            Err(RepoError::NotFound(_)) => {
                self.ensure_resource_exists(resource_id).await?;
                now_millis()
            }
            Err(e) => return Err(map_repo_error(e, "get theory content")),
        };

        let data = TheoryContentData {
            resource_id: resource_id.to_string(),
            content,
            created_at,
            updated_at: now_millis(),
        };

        self.theory_repo
            .upsert(data)
            .await
            .map_err(|e| map_repo_error(e, "save theory content"))
    }

    /// Очистка: если строки нет — очищать нечего, возвращается тот же пустой
    /// корень без записи; иначе пустой корень сохраняется с прежним `created_at`.
    pub async fn clear(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        match self.theory_repo.get(resource_id).await {
            Ok(_) => self.save(resource_id, empty_lexical_state()).await,
            Err(RepoError::NotFound(_)) => self.get_or_default(resource_id).await,
            Err(e) => Err(map_repo_error(e, "get theory content")),
        }
    }

    pub async fn delete(&self, resource_id: &str) -> Result<TheoryContentData, TheoryServiceError> {
        self.theory_repo
            .delete(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "delete theory content"))
    }

    /// Проверка существования ресурса: без неё ленивая запись упирается в
    /// нарушение FK и превращается в `Internal` вместо честного `NotFound`.
    async fn ensure_resource_exists(&self, resource_id: &str) -> Result<(), TheoryServiceError> {
        self.resource_repo
            .get(resource_id)
            .await
            .map_err(|e| map_repo_error(e, "check resource for theory content"))?;

        Ok(())
    }
}
