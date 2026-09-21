use std::sync::Arc;

use serde_json::{Map, Value};

use crate::database::repository::settings::SettingsRepository;
use crate::database::repository::RepoError;

use super::data::SettingsItemData;
use super::exceptions::SettingsServiceError;
use super::rules::{self, DEFAULT_SCHEMA_VERSION};
use super::schemas::{SchemaRegistry, SettingSchema};

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> SettingsServiceError {
    match e {
        RepoError::NotFound(msg) => SettingsServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            SettingsServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            SettingsServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

/// Валидация и нормализация одного поля: разрешение value из field default
/// или канонического дефолта модуля-схемы. Возвращает (value, default).
fn resolve_field(
    schema: &dyn SettingSchema,
    params: &Value,
    field_value: Option<Value>,
    field_default: Option<Value>,
) -> Result<(Value, Option<Value>), SettingsServiceError> {
    let module_default = schema.default_value(params)?;

    let value = field_value
        .or_else(|| field_default.clone())
        .or(module_default.clone())
        .ok_or_else(|| {
            SettingsServiceError::Validation(
                "Field requires a 'value' or a resolvable default".into(),
            )
        })?;

    schema.validate_value(params, &value)?;
    if let Some(default) = &field_default {
        schema.validate_value(params, default)?;
    }

    let default = field_default.or(module_default);
    Ok((value, default))
}

pub struct SettingsService {
    repo: Arc<dyn SettingsRepository>,
    registry: SchemaRegistry,
}

impl SettingsService {
    pub fn new(repo: Arc<dyn SettingsRepository>) -> Self {
        Self {
            repo,
            registry: SchemaRegistry::with_defaults(),
        }
    }

    /// Получить документ пункта. Отсутствующий пункт — не ошибка, возвращается None
    /// (набор настроек пункта пуст, потребитель подставляет дефолты).
    pub async fn get(
        &self,
        domain: &str,
        item_id: &str,
    ) -> Result<Option<SettingsItemData>, SettingsServiceError> {
        rules::validate_domain(domain)?;
        let item_id = rules::validate_item_id(item_id)?;

        match self.repo.get(domain, &item_id).await {
            Ok(data) => Ok(Some(data)),
            Err(RepoError::NotFound(_)) => Ok(None),
            Err(e) => Err(map_repo_error(e, &format!("get settings '{}'", item_id))),
        }
    }

    /// Сохранить документ пункта (upsert): валидация по реестру схем,
    /// нормализация дефолтов. Возвращает итоговый документ.
    pub async fn update(
        &self,
        domain: &str,
        item_id: &str,
        document: Value,
    ) -> Result<SettingsItemData, SettingsServiceError> {
        rules::validate_domain(domain)?;
        let item_id = rules::validate_item_id(item_id)?;
        rules::validate_document_size(&document)?;

        let settings = self.normalize_document(&document)?;
        rules::validate_document_size(&settings)?;

        let now = now_millis();
        let existing = match self.repo.get(domain, &item_id).await {
            Ok(data) => Some(data),
            Err(RepoError::NotFound(_)) => None,
            Err(e) => return Err(map_repo_error(e, &format!("get settings '{}'", item_id))),
        };

        let data = SettingsItemData {
            domain: domain.to_string(),
            item_id: item_id.clone(),
            settings,
            schema_version: existing
                .as_ref()
                .map(|entry| entry.schema_version)
                .unwrap_or(DEFAULT_SCHEMA_VERSION),
            created_at: existing.map(|entry| entry.created_at).unwrap_or(now),
            updated_at: now,
        };

        self.repo
            .set(data)
            .await
            .map_err(|e| map_repo_error(e, &format!("set settings '{}:{}'", domain, item_id)))
    }

    /// Удалить пункт. Идемпотентна: true если удалён, false если пункта не было.
    pub async fn delete(&self, domain: &str, item_id: &str) -> Result<bool, SettingsServiceError> {
        rules::validate_domain(domain)?;
        let item_id = rules::validate_item_id(item_id)?;

        match self.repo.delete(domain, &item_id).await {
            Ok(_) => Ok(true),
            Err(RepoError::NotFound(_)) => Ok(false),
            Err(e) => Err(map_repo_error(e, &format!("delete settings '{}'", item_id))),
        }
    }

    /// Проверка документа по реестру схем и нормализация: `{ fieldKey: { type,
    /// params?, default?, value } }` → тот же объект, где отсутствующие value
    /// заполнены из default/канонического дефолта, канонический default
    /// дописан в поле.
    fn normalize_document(&self, document: &Value) -> Result<Value, SettingsServiceError> {
        let map = document.as_object().ok_or_else(|| {
            SettingsServiceError::Validation("Settings document must be a JSON object".into())
        })?;
        if map.len() > rules::MAX_FIELDS {
            return Err(SettingsServiceError::Validation(format!(
                "Settings document must not exceed {} fields.",
                rules::MAX_FIELDS
            )));
        }

        let mut normalized: Map<String, Value> = Map::new();
        for (key, raw_field) in map {
            rules::validate_field_key(key)?;

            let field = raw_field.as_object().ok_or_else(|| {
                SettingsServiceError::Validation(format!("Field '{}' must be a JSON object", key))
            })?;
            let type_name = field.get("type").and_then(Value::as_str).ok_or_else(|| {
                SettingsServiceError::Validation(format!(
                    "Field '{}' requires a string 'type'",
                    key
                ))
            })?;
            let schema = self.registry.get(type_name).ok_or_else(|| {
                SettingsServiceError::Validation(format!("Unknown setting type '{}'", type_name))
            })?;

            let params = field
                .get("params")
                .cloned()
                .unwrap_or_else(|| Value::Object(Map::new()));
            schema.validate_params(&params)?;

            let (value, default) = resolve_field(
                schema,
                &params,
                field.get("value").cloned(),
                field.get("default").cloned(),
            )?;

            let mut out = Map::new();
            out.insert("type".to_string(), Value::String(type_name.to_string()));
            if field.contains_key("params") {
                out.insert("params".to_string(), params);
            }
            if let Some(default) = default {
                out.insert("default".to_string(), default);
            }
            out.insert("value".to_string(), value);

            normalized.insert(key.clone(), Value::Object(out));
        }

        Ok(Value::Object(normalized))
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;
    use std::sync::Mutex;

    use serde_json::json;

    use crate::database::repository::RepoResult;

    use super::SettingsService;
    use super::{map_repo_error, resolve_field, SettingsItemData};
    use crate::database::repository::settings::SettingsRepository;
    use crate::database::repository::RepoError;

    struct StubSettingsRepository {
        entries: Mutex<HashMap<(String, String), SettingsItemData>>,
    }

    impl StubSettingsRepository {
        fn new() -> Self {
            Self {
                entries: Mutex::new(HashMap::new()),
            }
        }
    }

    #[async_trait::async_trait]
    impl SettingsRepository for StubSettingsRepository {
        async fn get(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData> {
            self.entries
                .lock()
                .expect("poisoned")
                .get(&(domain.to_string(), item_id.to_string()))
                .cloned()
                .ok_or_else(|| RepoError::NotFound(format!("{}:{}", domain, item_id)))
        }

        async fn set(&self, data: SettingsItemData) -> RepoResult<SettingsItemData> {
            self.entries
                .lock()
                .expect("poisoned")
                .insert((data.domain.clone(), data.item_id.clone()), data.clone());
            Ok(data)
        }

        async fn delete(&self, domain: &str, item_id: &str) -> RepoResult<SettingsItemData> {
            self.entries
                .lock()
                .expect("poisoned")
                .remove(&(domain.to_string(), item_id.to_string()))
                .ok_or_else(|| RepoError::NotFound(format!("{}:{}", domain, item_id)))
        }
    }

    fn service() -> SettingsService {
        SettingsService::new(std::sync::Arc::new(StubSettingsRepository::new()))
    }

    #[test]
    fn normalize_fills_defaults_and_values() {
        let service = service();
        let doc = json!({
            "theme": { "type": "single_selection", "params": { "options": ["system","dark"] }, "default": "dark" },
            "autoSave": { "type": "toggle" }
        });

        let normalized = service.normalize_document(&doc).unwrap();
        let theme = &normalized["theme"];
        assert_eq!(theme["value"], json!("dark"));
        assert_eq!(theme["default"], json!("dark"));
        let auto_save = &normalized["autoSave"];
        assert_eq!(auto_save["value"], json!(false));
        assert_eq!(auto_save["default"], json!(false));
    }

    #[test]
    fn normalize_rejects_unknown_type_and_bad_value() {
        let service = service();
        let unknown = json!({ "x": { "type": "slider" } });
        assert!(service.normalize_document(&unknown).is_err());

        let bad_value = json!({ "x": { "type": "toggle", "value": "yes" } });
        assert!(service.normalize_document(&bad_value).is_err());

        let no_default =
            json!({ "x": { "type": "single_selection", "params": { "options": ["a","b"] } } });
        assert!(service.normalize_document(&no_default).is_err());
    }

    #[tokio::test]
    async fn update_preserves_created_at_and_get_returns_none_first() {
        let service = service();
        let doc = json!({ "lang": { "type": "single_selection", "params": { "options": ["ru","en"] }, "value": "ru", "default": "ru" } });

        assert!(service.get("system", "theming").await.unwrap().is_none());

        let first = service.update("system", "theming", doc).await.unwrap();
        let second = service
            .update(
                "system",
                "theming",
                json!({ "lang": { "type": "single_selection", "params": { "options": ["ru","en"] }, "value": "en", "default": "ru" } }),
            )
            .await
            .unwrap();

        assert_eq!(first.created_at, second.created_at);
        assert_eq!(second.settings["lang"]["value"], json!("en"));
        assert_eq!(
            service
                .get("system", "theming")
                .await
                .unwrap()
                .unwrap()
                .domain,
            "system"
        );
    }

    #[tokio::test]
    async fn delete_is_idempotent() {
        let service = service();
        assert!(!service.delete("plugin", "some-plugin").await.unwrap());
        service
            .update("plugin", "some-plugin", json!({}))
            .await
            .unwrap();
        assert!(service.delete("plugin", "some-plugin").await.unwrap());
        assert!(!service.delete("plugin", "some-plugin").await.unwrap());
    }

    #[test]
    fn resolve_field_validates_default_too() {
        let schema = service().registry.get("toggle").unwrap();
        let err = resolve_field(schema, &json!({}), Some(json!(true)), Some(json!("bad")));
        assert!(err.is_err());
    }

    #[test]
    fn map_covers_error_variants() {
        let not_found = map_repo_error(RepoError::NotFound("x".into()), "ctx");
        assert!(matches!(
            not_found,
            super::SettingsServiceError::NotFound(_)
        ));
        let db = map_repo_error(RepoError::Db(sqlx::Error::RowNotFound), "ctx");
        assert!(matches!(db, super::SettingsServiceError::Internal(_)));
    }
}
