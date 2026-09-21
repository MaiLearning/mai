use serde_json::Value;

use super::super::{parse_params, SchemaError, SettingSchema};
use super::validate_options;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct SingleSelectionParams {
    #[serde(default)]
    options: Vec<String>,
}

pub static INSTANCE: SingleSelectionSchema = SingleSelectionSchema;

/// Выбор одного из заданных значений. `params`: `{ options: [...] }`.
/// Дефолт тип не знает — обязан быть указан в поле `"default"`.
pub struct SingleSelectionSchema;

impl SettingSchema for SingleSelectionSchema {
    fn type_name(&self) -> &'static str {
        "single_selection"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<SingleSelectionParams>(params)?;
        validate_options(&p.options)
    }

    fn validate_value(&self, params: &Value, value: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<SingleSelectionParams>(params)?;
        let Some(selected) = value.as_str() else {
            return Err(SchemaError::new("value must be a string"));
        };

        if p.options.iter().any(|option| option == selected) {
            Ok(())
        } else {
            Err(SchemaError::new("value must be one of the options"))
        }
    }

    fn default_value(&self, _params: &Value) -> Result<Option<Value>, SchemaError> {
        Ok(None)
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::super::super::SettingSchema;
    use super::INSTANCE;

    fn params() -> serde_json::Value {
        json!({ "options": ["system", "light", "dark"] })
    }

    #[test]
    fn params_require_options() {
        assert!(INSTANCE.validate_params(&json!({})).is_err());
        assert!(INSTANCE.validate_params(&params()).is_ok());
    }

    #[test]
    fn value_must_be_in_options() {
        assert!(INSTANCE.validate_value(&params(), &json!("dark")).is_ok());
        assert!(INSTANCE.validate_value(&params(), &json!("neon")).is_err());
        assert!(INSTANCE.validate_value(&params(), &json!(true)).is_err());
    }

    #[test]
    fn no_implicit_default() {
        assert_eq!(INSTANCE.default_value(&params()).unwrap(), None);
    }
}
