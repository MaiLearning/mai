use serde_json::Value;
use sqlx::SqlitePool;

use super::data::{GatewayCallRequest, GatewayError, GatewayErrorCode};
use super::registry;
use crate::plugins::link::gateway as link_gateway;
use crate::plugins::task::gateway;
use crate::services::events::SharedChangePublisher;

/// Маршрутизация gateway-вызова к обработчику плагина.
///
/// Плагины скомпилированы в приложение, поэтому роутинг статический:
/// новая пара (плагин, метод) — новая ветка match. Мутационные обработчики
/// получают publisher (публикация событий изменений) и caller (идентичность
/// вызова: владелец рёбер выводится из него, не из args).
pub async fn dispatch(
    pool: &SqlitePool,
    publisher: SharedChangePublisher,
    request: GatewayCallRequest,
) -> Result<Value, GatewayError> {
    match (request.plugin_id.as_str(), request.method.as_str()) {
        (gateway::PLUGIN_ID, gateway::METHOD_SNAPSHOT) => {
            gateway::snapshot(request.args, pool).await
        }
        (gateway::PLUGIN_ID, gateway::METHOD_ATTEMPTS) => {
            gateway::attempts(request.args, pool).await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_CREATE) => {
            link_gateway::create(request.args, request.caller.as_deref(), publisher, pool).await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_UPDATE) => {
            link_gateway::update(request.args, request.caller.as_deref(), publisher, pool).await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_DELETE) => {
            link_gateway::delete(request.args, request.caller.as_deref(), publisher, pool).await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_DELETE_BY_SOURCE) => {
            link_gateway::delete_by_source(request.args, request.caller.as_deref(), publisher, pool)
                .await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_LIST_BY_SOURCE) => {
            link_gateway::list_by_source(request.args, request.caller.as_deref(), publisher, pool)
                .await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_LIST_BACKLINKS) => {
            link_gateway::list_backlinks(request.args, request.caller.as_deref(), publisher, pool)
                .await
        }
        (link_gateway::PLUGIN_ID, link_gateway::METHOD_COURSE_GRAPH) => {
            link_gateway::course_graph(request.args, request.caller.as_deref(), publisher, pool)
                .await
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
    use crate::services::events::{ChangePublisher, EntityChanged};
    use serde_json::json;
    use sqlx::sqlite::SqliteConnectOptions;
    use std::str::FromStr;

    /// Ленивый пул: соединение не открывается, пока к БД не обратятся —
    /// тесты роутинга и разбора аргументов не требуют БД.
    fn test_pool() -> SqlitePool {
        let options = SqliteConnectOptions::from_str("sqlite::memory:").unwrap();
        SqlitePool::connect_lazy_with(options)
    }

    /// Паблишер-заглушка: тесты роутинга событий не публикуют.
    #[derive(Default)]
    struct NoopPublisher;

    impl ChangePublisher for NoopPublisher {
        fn publish(&self, _event: EntityChanged) {}
    }

    fn publisher() -> SharedChangePublisher {
        std::sync::Arc::new(NoopPublisher)
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
            dispatch(
                &pool,
                publisher(),
                request("no-such-plugin", "anything", json!({})),
            )
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
                publisher(),
                request(gateway::PLUGIN_ID, "no-such-method", json!({})),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::MethodNotFound);
    }

    #[test]
    fn link_unknown_method_of_registered_plugin_returns_method_not_found() {
        let error = tauri::async_runtime::block_on(async {
            let pool = test_pool();
            dispatch(
                &pool,
                publisher(),
                request(link_gateway::PLUGIN_ID, "no-such-method", json!({})),
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
                publisher(),
                request(gateway::PLUGIN_ID, gateway::METHOD_SNAPSHOT, json!({})),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::BadArgs);
    }

    #[test]
    fn link_invalid_args_return_bad_args_before_db_touch() {
        let error = tauri::async_runtime::block_on(async {
            let pool = test_pool();
            dispatch(
                &pool,
                publisher(),
                request(
                    link_gateway::PLUGIN_ID,
                    link_gateway::METHOD_CREATE,
                    json!({}),
                ),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::BadArgs);
    }
}
