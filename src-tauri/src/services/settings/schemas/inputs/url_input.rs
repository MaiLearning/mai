use serde_json::{json, Value};

use super::super::{parse_params, SchemaError, SettingSchema};

/// Потолок длины URL — защита размера документа.
const MAX_URL_LENGTH: usize = 2_048;

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct UrlInputParams {
    #[serde(default)]
    max_length: Option<usize>,
}

pub static INSTANCE: UrlInputSchema = UrlInputSchema;

/// Ввод URL. `params`: `{ maxLength? }`. Значение — http(s)-ссылка или пустая строка.
pub struct UrlInputSchema;

fn valid_url(text: &str) -> bool {
    url::Url::parse(text)
        .map(|parsed| matches!(parsed.scheme(), "http" | "https"))
        .unwrap_or(false)
}

impl SettingSchema for UrlInputSchema {
    fn type_name(&self) -> &'static str {
        "url_input"
    }

    fn validate_params(&self, params: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<UrlInputParams>(params)?;

        if p.max_length.unwrap_or(0) > MAX_URL_LENGTH {
            return Err(SchemaError::new(format!(
                "maxLength must not exceed {}",
                MAX_URL_LENGTH
            )));
        }

        Ok(())
    }

    fn validate_value(&self, params: &Value, value: &Value) -> Result<(), SchemaError> {
        let p = parse_params::<UrlInputParams>(params)?;
        let Some(text) = value.as_str() else {
            return Err(SchemaError::new("value must be a string"));
        };

        if text.is_empty() {
            return Ok(());
        }

        let max = p.max_length.unwrap_or(MAX_URL_LENGTH);
        if text.chars().count() > max {
            return Err(SchemaError::new(format!(
                "value must not exceed {} characters",
                max
            )));
        }
        if !valid_url(text) {
            return Err(SchemaError::new("value must be a valid http(s) URL"));
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
    fn accepts_http_https_and_empty() {
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("https://example.com/a?b=1"))
            .is_ok());
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("http://localhost:3000"))
            .is_ok());
        assert!(INSTANCE.validate_value(&json!({}), &json!("")).is_ok());
    }

    #[test]
    fn rejects_invalid_urls() {
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("not a url"))
            .is_err());
        assert!(INSTANCE
            .validate_value(&json!({}), &json!("ftp://example.com"))
            .is_err());
        assert!(INSTANCE
            .validate_value(&json!({ "maxLength": 8 }), &json!("https://example.com"))
            .is_err());
    }
}
