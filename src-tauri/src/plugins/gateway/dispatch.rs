use serde_json::Value;
use sqlx::SqlitePool;

use super::data::{GatewayCallRequest, GatewayError};
use super::router::{router, unknown_route_error, GatewayCtx};
use crate::services::events::SharedChangePublisher;

/// Маршрутизация gateway-вызова через реестр методов (`router.rs`).
///
/// Плагины объявляют `routes()` в своём `gateway/manifest.rs`; ядро не знает
/// отдельных обработчиков. Обработчик получает контекст (пул, паблишер,
/// caller) единообразно.
pub async fn dispatch(
    pool: &SqlitePool,
    publisher: SharedChangePublisher,
    request: GatewayCallRequest,
) -> Result<Value, GatewayError> {
    let Some(route) = router().lookup(&request.plugin_id, &request.method) else {
        return Err(unknown_route_error(&request.plugin_id, &request.method));
    };
    let ctx = GatewayCtx {
        pool: pool.clone(),
        publisher,
        caller: request.caller,
    };
    route.handler.call(request.args, ctx).await
}

#[cfg(test)]
mod tests {
    use std::collections::BTreeSet;

    use super::super::data::GatewayErrorCode;
    use super::super::registry;
    use super::super::router::router;
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
                request(
                    crate::plugins::task::gateway::PLUGIN_ID,
                    "no-such-method",
                    json!({}),
                ),
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
                request(
                    crate::plugins::link::gateway::PLUGIN_ID,
                    "no-such-method",
                    json!({}),
                ),
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
                request(
                    crate::plugins::task::gateway::PLUGIN_ID,
                    crate::plugins::task::gateway::METHOD_SNAPSHOT,
                    json!({}),
                ),
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
                    crate::plugins::link::gateway::PLUGIN_ID,
                    crate::plugins::link::gateway::METHOD_CREATE,
                    json!({}),
                ),
            )
            .await
            .unwrap_err()
        });
        assert_eq!(error.code, GatewayErrorCode::BadArgs);
    }

    /// Манифест (дискавери) и реестр маршрутов обязаны совпадать по методам
    /// у каждого плагина — в обе стороны.
    #[test]
    fn routes_match_manifests_for_every_plugin() {
        for manifest in registry::gateway_manifests() {
            let routes: BTreeSet<_> = router()
                .methods_of(&manifest.plugin_id)
                .into_iter()
                .collect();
            let documented: BTreeSet<_> =
                manifest.methods.iter().map(|m| m.name.as_str()).collect();
            assert_eq!(
                routes, documented,
                "manifest/routes расходятся у {}",
                manifest.plugin_id
            );
        }
    }
}
