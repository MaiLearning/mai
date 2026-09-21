use std::collections::BTreeSet;

use serde_json::{json, Value};

use super::super::{parse_params, SchemaError, SettingSchema};
use super::validate_options;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct MultiSelectionParams {
    #[serde(default)]
    options: Vec<String>,
}

pub static INSTANCE: MultiSelectionSchema = MultiSelectionSchema;

/// Выбор нескольких значений. `params`: `{ options: [...] }`.
/// Значение — массив строк из options без дублей. Дефолт — пустой список.
pub struct MultiSelectionSchema;

impl SettingSchema for MultiSelectionSchema {
    fn type_name(&self) -> &'static str {
        "multi_selection"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<MultiSelectionParams>(params)?;
        validate_options(&p.options)
    }

    fn validate_value(&self, params: &Value, value: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<MultiSelectionParams>(params)?;
        let Some(selected) = value.as_array() else {
            return Err(SchemaError::new("value must be an array of strings"));
        };

        let mut seen = BTreeSet::new();
        for item in selected {
            let Some(text) = item.as_str() else {
                return Err(SchemaError::new("value items must be strings"));
            };
            if !p.options.iter().any(|option| option == text) {
                return Err(SchemaError::new(
                    "every value item must be one of the options",
                ));
            }
            if !seen.insert(text) {
                return Err(SchemaError::new("value items must be unique"));
            }
        }

        Ok(())
    }

    fn default_value(&self, _params: &Value) -> Result<Option<Value>, SchemaError> {
        Ok(Some(json!([])))
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::super::super::SettingSchema;
    use super::INSTANCE;

    fn params() -> serde_json::Value {
        json!({ "options": ["теория", "практика", "задачи"] })
    }

    #[test]
    fn value_accepts_subset_in_any_order() {
        assert!(INSTANCE
            .validate_value(&params(), &json!(["практика", "теория"]))
            .is_ok());
        assert!(INSTANCE.validate_value(&params(), &json!([])).is_ok());
    }

    #[test]
    fn value_rejects_unknowns_and_duplicates() {
        assert!(INSTANCE
            .validate_value(&params(), &json!(["видео"]))
            .is_err());
        assert!(INSTANCE
            .validate_value(&params(), &json!(["теория", "теория"]))
            .is_err());
        assert!(INSTANCE
            .validate_value(&params(), &json!("теория"))
            .is_err());
    }

    #[test]
    fn default_is_empty_list() {
        assert_eq!(INSTANCE.default_value(&params()).unwrap(), Some(json!([])));
    }
}
