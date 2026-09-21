pub mod inputs;
pub mod selection;
pub mod toggle;

use std::collections::HashMap;
use std::fmt;

use serde_json::Value;

/// Ошибка схемы типа настройки (валидация params / value внутри модуля-схемы).
#[derive(Debug, Clone)]
pub struct SchemaError {
    pub message: String,
}

impl SchemaError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}

impl fmt::Display for SchemaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Setting schema error: {}", self.message)
    }
}

impl std::error::Error for SchemaError {}

/// Модуль-схема одного типа настройки. Регистрируется в `SchemaRegistry`.
///
/// Конвенция модуля:
/// - `type_name` — ключ реестра, на который ссылается `"type"` в JSON-поле;
/// - `params` — параметры поля (`"params"` в JSON), структура своя на тип,
///   отсутствующие (или `null`) нормализуются в `{}` на уровне сервиса;
/// - `default_value` — канонический дефолт по params; `None` — тип не знает
///   дефолт сам, тогда `"default"` обязан быть указан в поле.
pub trait SettingSchema: Send + Sync {
    fn type_name(&self) -> &'static str;

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError>;

    fn validate_value(&self, params: &Value, value: &Value) -> Result<(), SchemaError>;

    fn default_value(&self, params: &Value) -> Result<Option<Value>, SchemaError>;
}

/// Реестр схем типов: `type_name` → статический экземпляр модуля-схемы.
#[derive(Default)]
pub struct SchemaRegistry {
    schemas: HashMap<&'static str, &'static dyn SettingSchema>,
}

impl SchemaRegistry {
    /// Реестр со стартовым набором типов. Новый тип = новый модуль + строка здесь.
    pub fn with_defaults() -> Self {
        let mut registry = Self::default();
        registry.register(&inputs::text_input::INSTANCE);
        registry.register(&inputs::date_input::INSTANCE);
        registry.register(&inputs::url_input::INSTANCE);
        registry.register(&selection::single_selection::INSTANCE);
        registry.register(&selection::multi_selection::INSTANCE);
        registry.register(&toggle::INSTANCE);
        registry
    }

    pub fn register(&mut self, schema: &'static dyn SettingSchema) {
        self.schemas.insert(schema.type_name(), schema);
    }

    pub fn get(&self, type_name: &str) -> Option<&'static dyn SettingSchema> {
        self.schemas.get(type_name).copied()
    }
}

/// Десериализация `params` в структуру модуля. На вход ожидается JSON-объект
/// (сервис нормализует отсутствующие params в `{}`), лишние ключи — ошибка.
pub(crate) fn parse_params<T>(params: &Value) -> Result<T, SchemaError>
where
    T: for<'de> serde::Deserialize<'de>,
{
    serde_json::from_value(params.clone())
        .map_err(|e| SchemaError::new(format!("Invalid params: {}", e)))
}
