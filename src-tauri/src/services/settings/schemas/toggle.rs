use serde_json::{json, Value};

use super::{parse_params, SchemaError, SettingSchema};

#[derive(serde::Deserialize)]
#[serde(deny_unknown_fields)]
struct ToggleParams {}

pub static INSTANCE: ToggleSchema = ToggleSchema;

/// Переключатель on/off. `params`: нет. Значение — boolean. Дефолт — `false`.
pub struct ToggleSchema;

impl SettingSchema for ToggleSchema {
    fn type_name(&self) -> &'static str {
        "toggle"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        parse_params::<ToggleParams>(params).map(|_| ())
    }

    fn validate_value(&self, _params: &Value, value: &Value) -> Result<(), SchemaError> {
        if value.is_boolean() {
            Ok(())
        } else {
            Err(SchemaError::new("value must be a boolean"))
        }
    }

    fn default_value(&self, _params: &Value) -> Result<Option<Value>, SchemaError> {
        Ok(Some(json!(false)))
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::super::SettingSchema;
    use super::INSTANCE;

    #[test]
    fn value_must_be_boolean() {
        assert!(INSTANCE.validate_value(&json!({}), &json!(true)).is_ok());
        assert!(INSTANCE.validate_value(&json!({}), &json!(false)).is_ok());
        assert!(INSTANCE.validate_value(&json!({}), &json!("true")).is_err());
    }

    #[test]
    fn default_is_false() {
        assert_eq!(
            INSTANCE.default_value(&json!({})).unwrap(),
            Some(json!(false))
        );
    }
}
