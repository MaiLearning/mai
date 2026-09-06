use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::plugins::gateway::data::{GatewayCallRequest, GatewayError, GatewayErrorCode};
use crate::plugins::gateway::dispatch::dispatch;
use crate::server::state::AppState;

use super::router::map_error;

/// Вызов метода gateway-плагина по HTTP.
///
/// Тело запроса — JSON-объект аргументов метода (может быть пустым).
/// Caller фиксируется как `"http"`: будущие права (data-rights) отличат
/// внешние вызовы от `"app"`.
#[utoipa::path(
    post,
    path = "/plugin/{plugin_id}/{method}",
    tag = "plugin_gateway",
    operation_id = "plugin_gateway_call",
    params(
        ("plugin_id" = String, Path, description = "Идентификатор gateway-плагина (см. /plugin/manifests)"),
        ("method" = String, Path, description = "Имя метода плагина (см. /plugin/manifests)")
    ),
    responses(
        (status = 200, description = "Результат метода (произвольный JSON)"),
        (status = 400, description = "Некорректное тело или аргументы", body = GatewayError),
        (status = 403, description = "Вызов запрещён правами", body = GatewayError),
        (status = 404, description = "Плагин, метод или сущность не найдены", body = GatewayError),
        (status = 500, description = "Ошибка обработчика", body = GatewayError)
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Path((plugin_id, method)): Path<(String, String)>,
    body: axum::body::Bytes,
) -> impl IntoResponse {
    let args = match parse_args_body(&body) {
        Ok(args) => args,
        Err(err) => return map_error(err),
    };

    let request = GatewayCallRequest {
        plugin_id,
        method,
        args,
        caller: Some("http".to_string()),
    };

    match dispatch(&state.pool, state.publisher.clone(), request).await {
        Ok(result) => (StatusCode::OK, Json(result)),
        Err(err) => map_error(err),
    }
}

/// Тело запроса → аргументы метода: пустое тело = `{}`, иначе строгий JSON.
fn parse_args_body(body: &[u8]) -> Result<serde_json::Value, GatewayError> {
    if body.is_empty() {
        return Ok(serde_json::json!({}));
    }
    serde_json::from_slice(body).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::BadArgs,
            format!("Некорректное JSON-тело: {e}"),
        )
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_body_becomes_empty_object() {
        let args = parse_args_body(b"").unwrap();
        assert_eq!(args, serde_json::json!({}));
    }

    #[test]
    fn json_object_body_is_parsed() {
        let args = parse_args_body(br#"{"resourceId":"r-1"}"#).unwrap();
        assert_eq!(args, serde_json::json!({"resourceId": "r-1"}));
    }

    #[test]
    fn invalid_json_returns_bad_args() {
        let err = parse_args_body(b"{oops").unwrap_err();
        assert_eq!(err.code, GatewayErrorCode::BadArgs);
    }
}
