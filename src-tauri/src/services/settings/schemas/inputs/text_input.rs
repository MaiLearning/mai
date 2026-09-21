use serde_json::{json, Value};

use super::super::{parse_params, SchemaError, SettingSchema};

/// Потолок длины текста — защита размера документа.
const MAX_TEXT_LENGTH: usize = 10_000;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct TextInputParams {
    #[serde(default)]
    min_length: Option<usize>,
    #[serde(default)]
    max_length: Option<usize>,
}

pub static INSTANCE: TextInputSchema = TextInputSchema;

/// Ввод текста. `params`: `{ minLength?, maxLength? }`. Значение — строка.
pub struct TextInputSchema;

impl SettingSchema for TextInputSchema {
    fn type_name(&self) -> &'static str {
        "text_input"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<TextInputParams>(params)?;

        if let (Some(min), Some(max)) = (p.min_length, p.max_length) {
            if min > max {
                return Err(SchemaError::new("minLength must not exceed maxLength"));
            }
        }
        if p.max_length.unwrap_or(0) > MAX_TEXT_LENGTH {
            return Err(SchemaError::new(format!(
                "maxLength must not exceed {}",
                MAX_TEXT_LENGTH
            )));
        }

        Ok(())
    }

    fn validate_value(&self, params: &Value, value: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<TextInputParams>(params)?;
        let Some(text) = value.as_str() else {
            return Err(SchemaError::new("value must be a string"));
        };

        let length = text.chars().count();
        if let Some(min) = p.min_length {
            if length < min {
                return Err(SchemaError::new(format!(
                    "value must be at least {} characters",
                    min
                )));
            }
        }
        if let Some(max) = p.max_length {
            if length > max {
                return Err(SchemaError::new(format!(
                    "value must not exceed {} characters",
                    max
                )));
            }
        }

        Ok(())
    }

    fn default_value(&self, _params: &Value) -> Result<Option<Value>, SchemaError> {
        Ok(Some(json!("")))
    }
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::super::super::SettingSchema;
    use super::INSTANCE;

    #[test]
    fn params_reject_bad_ranges() {
        assert!(INSTANCE
            .validate_params(&json!({ "minLength": 5, "maxLength": 3 }))
            .is_err());
        assert!(INSTANCE
            .validate_params(&json!({ "maxLength": 20_000 }))
            .is_err());
    }

    #[test]
    fn value_length_bounds() {
        assert!(INSTANCE.validate_value(&json!({}), &json!("abc")).is_ok());
        assert!(INSTANCE
            .validate_value(&json!({ "minLength": 3 }), &json!("ab"))
            .is_err());
        assert!(INSTANCE
            .validate_value(&json!({ "maxLength": 2 }), &json!("abc"))
            .is_err());
        assert!(INSTANCE.validate_value(&json!({}), &json!(42)).is_err());
    }

    #[test]
    fn default_is_empty_string() {
        assert_eq!(INSTANCE.default_value(&json!({})).unwrap(), Some(json!("")));
    }
}
