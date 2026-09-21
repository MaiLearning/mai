use serde_json::{json, Value};

use super::super::{parse_params, SchemaError, SettingSchema};

#[derive(serde::Deserialize)]
#[serde(deny_unknown_fields)]
struct DateInputParams {}

pub static INSTANCE: DateInputSchema = DateInputSchema;

/// Ввод даты. `params`: нет. Значение — ISO-8601 `YYYY-MM-DD` или пустая строка.
pub struct DateInputSchema;

impl SettingSchema for DateInputSchema {
    fn type_name(&self) -> &'static str {
        "date_input"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        parse_params::<DateInputParams>(params).map(|_| ())
    }

    fn validate_value(&self, _params: &Value, value: &Value) -> Result<(), SchemaError> {
        let Some(text) = value.as_str() else {
            return Err(SchemaError::new("value must be a string"));
        };

        if text.is_empty() || chrono::NaiveDate::parse_from_str(text, "%F").is_ok() {
            Ok(())
        } else {
            Err(SchemaError::new(
                "value must be an ISO-8601 date (YYYY-MM-DD) or empty",
            ))
        }
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
    fn accepts_iso_dates_and_empty() {
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("2026-09-21"))
            .is_ok());
        assert!(INSTANCE.validate_value(&json!({}), &json!("")).is_ok());
    }

    #[test]
    fn rejects_other_formats() {
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("21.09.2026"))
            .is_err());
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("2026-09-21T10:00:00"))
            .is_err());
        assert!(INSTANCE
            .validate_value(&json!({}), &json!(1727000000))
            .is_err());
    }
}
