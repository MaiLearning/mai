//! Общие хелперы gateway-обработчиков: разбор аргументов и сериализация
//! ответа. Свои копии в плагинах не заводить — импортировать отсюда.

use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::data::{GatewayError, GatewayErrorCode};

/// Разбор аргументов вызова в типизированную структуру.
pub fn parse_args<T: for<'de> Deserialize<'de>>(args: Value) -> Result<T, GatewayError> {
    serde_json::from_value(args).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::BadArgs,
            format!("Некорректные аргументы: {}", e),
        )
    })
}

/// Сериализация ответа обработчика.
pub fn to_value<T: Serialize>(data: &T) -> Result<Value, GatewayError> {
    serde_json::to_value(data).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::HandlerError,
            format!("Ошибка сериализации: {}", e),
        )
    })
}
