use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fmt;

/// Описание одного метода gateway-плагина (для дискавери).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayMethodInfo {
    pub name: String,
    pub description: String,
}

impl GatewayMethodInfo {
    pub fn new(name: &str, description: &str) -> Self {
        Self {
            name: name.to_string(),
            description: description.to_string(),
        }
    }
}

/// Манифест gateway-плагина: перечень открытых другим плагинам методов.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayManifest {
    pub plugin_id: String,
    pub version: String,
    pub methods: Vec<GatewayMethodInfo>,
}

/// Запрос вызова gateway-метода.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayCallRequest {
    pub plugin_id: String,
    pub method: String,
    #[serde(default)]
    pub args: Value,
    /// Кто вызывает: id плагина или `"app"`. Базис для будущих прав (data-rights).
    #[serde(default)]
    pub caller: Option<String>,
}

/// Код ошибки gateway-вызова.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum GatewayErrorCode {
    PluginNotFound,
    MethodNotFound,
    BadArgs,
    NotFound,
    HandlerError,
}

/// Структурированная ошибка gateway-вызова (сериализуется в rejection).
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GatewayError {
    pub code: GatewayErrorCode,
    pub message: String,
}

impl GatewayError {
    pub fn new(code: GatewayErrorCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
        }
    }
}

impl fmt::Display for GatewayError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}: {}", self.code, self.message)
    }
}

impl std::error::Error for GatewayError {}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn error_code_uses_camel_case_wire_names() {
        assert_eq!(
            serde_json::to_value(GatewayErrorCode::PluginNotFound).unwrap(),
            json!("pluginNotFound")
        );
        assert_eq!(
            serde_json::to_value(GatewayErrorCode::MethodNotFound).unwrap(),
            json!("methodNotFound")
        );
    }

    #[test]
    fn request_parses_camel_case_fields() {
        let request: GatewayCallRequest = serde_json::from_value(json!({
            "pluginId": "internal-task",
            "method": "snapshot",
            "args": {},
            "caller": "app"
        }))
        .unwrap();
        assert_eq!(request.plugin_id, "internal-task");
        assert_eq!(request.caller.as_deref(), Some("app"));
    }
}
