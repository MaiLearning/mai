use std::sync::Arc;

use crate::database::repository::kv::KvRepository;
use crate::database::repository::RepoError;

use super::data::KvEntryData;
use super::exceptions::KvServiceError;
use super::rules;

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> KvServiceError {
    match e {
        RepoError::NotFound(msg) => KvServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            KvServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            KvServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

pub struct KvService {
    kv_repo: Arc<dyn KvRepository>,
}

impl KvService {
    pub fn new(kv_repo: Arc<dyn KvRepository>) -> Self {
        Self { kv_repo }
    }

    /// Сохранить значение (upsert). Возвращает итоговую запись.
    pub async fn set(
        &self,
        key: &str,
        value: serde_json::Value,
    ) -> Result<KvEntryData, KvServiceError> {
        let resolved_key = rules::validate_key(key)?;

        let now = now_millis();
        let created_at = match self.kv_repo.get(&resolved_key).await {
            Ok(entry) => entry.created_at,
            Err(RepoError::NotFound(_)) => now,
            Err(e) => return Err(map_repo_error(e, &format!("get key '{}'", resolved_key))),
        };

        let data = KvEntryData {
            key: resolved_key.clone(),
            value,
            created_at,
            updated_at: now,
        };
        rules::validate_value(&data)?;

        let data = self
            .kv_repo
            .set(data)
            .await
            .map_err(|e| map_repo_error(e, &format!("set key '{}'", resolved_key)))?;

        Ok(data)
    }

    /// Получить значение. Отсутствующий ключ — не ошибка, возвращается None.
    pub async fn get(&self, key: &str) -> Result<Option<serde_json::Value>, KvServiceError> {
        let resolved_key = rules::validate_key(key)?;
        match self.kv_repo.get(&resolved_key).await {
            Ok(entry) => Ok(Some(entry.value)),
            Err(RepoError::NotFound(_)) => Ok(None),
            Err(e) => Err(map_repo_error(e, &format!("get key '{}'", resolved_key))),
        }
    }

    /// Удалить ключ. Идемпотентна: true если удалён, false если ключа не было.
    pub async fn delete(&self, key: &str) -> Result<bool, KvServiceError> {
        let resolved_key = rules::validate_key(key)?;
        match self.kv_repo.delete(&resolved_key).await {
            Ok(_) => Ok(true),
            Err(RepoError::NotFound(_)) => Ok(false),
            Err(e) => Err(map_repo_error(e, &format!("delete key '{}'", resolved_key))),
        }
    }

    pub async fn exists(&self, key: &str) -> Result<bool, KvServiceError> {
        let resolved_key = rules::validate_key(key)?;
        self.kv_repo
            .exists(&resolved_key)
            .await
            .map_err(|e| map_repo_error(e, &format!("check existence of '{}'", resolved_key)))
    }

    /// Список ключей, опционально отфильтрованных префиксом.
    pub async fn list_keys(&self, prefix: Option<&str>) -> Result<Vec<String>, KvServiceError> {
        let resolved_prefix = match prefix {
            Some(p) => Some(rules::validate_key(p)?),
            None => None,
        };
        self.kv_repo
            .list_keys(resolved_prefix.as_deref())
            .await
            .map_err(|e| map_repo_error(e, "list keys"))
    }
}
