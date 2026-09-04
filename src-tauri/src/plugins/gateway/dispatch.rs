use serde_json::Value;
use sqlx::SqlitePool;

use super::data::{GatewayCallRequest, GatewayError, GatewayErrorCode};
use super::registry;
use crate::plugins::task::gateway;

/// Маршрутизация gateway-вызова к обработчику плагина.
///
/// Плагины скомпилированы в приложение, поэтому роутинг статический:
/// новая пара (плагин, метод) — новая ветка match.
pub async fn dispatch(
    pool: &SqlitePool,
    request: GatewayCallRequest,
) -> Result<Value, GatewayError> {
    match (request.plugin_id.as_str(), request.method.as_str()) {
        (gateway::PLUGIN_ID, gateway::METHOD_SNAPSHOT) => {
            gateway::snapshot(request.args, pool).await
        }
        (gateway::PLUGIN_ID, gateway::METHOD_ATTEMPTS) => {
            gateway::attempts(request.args, pool).await
        }
        _ => {
            if registry::has_plugin(&request.plugin_id) {
                Err(GatewayError::new(
                    GatewayErrorCode::MethodNotFound,
                    format!(
                        "Метод '{}' не открыт плагином '{}'",
                        request.method, request.plugin_id
                    ),
                ))
            } else {
                Err(GatewayError::new(
                    GatewayErrorCode::PluginNotFound,
                    format!(
                        "Плагин '{}' не зарегистрирован в gateway",
                        request.plugin_id
                    ),
                ))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    use sqlx::sqlite::SqliteConnectOptions;
    use std::str::FromStr;

    /// Ленивый пул: соединение не открывается, пока к БД не обратятся —
    /// тесты роутинга и разбора аргументов не требуют БД.
    fn test_pool() -> SqlitePool {
        let options = SqliteConnectOptions::from_str("sqlite::memory:").unwrap();
        SqlitePool::connect_lazy_with(options)
    }

    fn request(plugin_id: &str, method: &str, args: Value) -> GatewayCallRequest {
        GatewayCallRequest {
            plugin_id: plugin_id.to_string(),
            method: method.to_string(),
            args,
            caller: Some("app".to_string()),
        }
    }

    #[test]
    fn unknown_plugin_returns_plugin_not_found() {
        let error = tauri::async_runtime::block_on(async {
            let pool = test_pool();
            dispatch(&pool, request("no-such-plugin", "anything", json!({})))
                .await
                .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::PluginNotFound);
    }

    #[test]
    fn unknown_method_of_known_plugin_returns_method_not_found() {
        let error = tauri::async_runtime::block_on(async {
            let pool = test_pool();
            dispatch(
                &pool,
                request(gateway::PLUGIN_ID, "no-such-method", json!({})),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::MethodNotFound);
    }

    #[test]
    fn invalid_args_return_bad_args() {
        let error = tauri::async_runtime::block_on(async {
            let pool = test_pool();
            dispatch(
                &pool,
                request(gateway::PLUGIN_ID, gateway::METHOD_SNAPSHOT, json!({})),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::BadArgs);
    }
}
