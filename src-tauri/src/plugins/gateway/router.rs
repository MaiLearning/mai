//! Реестр gateway-методов и контекст вызова.
//!
//! Вместо match по парам (плагин, метод) — таблица маршрутов: каждый плагин
//! объявляет `routes()` в своём `gateway/manifest.rs`, ядро собирает их в
//! `HashMap` один раз (`OnceLock`). Обработчики получают единый контекст
//! `GatewayCtx` (пул, паблишер, caller); read-обработчики игнорируют
//! ненужные поля. Сигнатура обработчика: `async fn(Value, GatewayCtx)`.

use std::collections::HashMap;
use std::future::Future;
use std::sync::OnceLock;

use async_trait::async_trait;
use serde_json::Value;
use sqlx::SqlitePool;

use super::data::{GatewayError, GatewayErrorCode};
use crate::services::events::SharedChangePublisher;

/// Контекст gateway-вызова: всё, что нужно обработчику, кроме аргументов.
/// Владеющий (клоны дёшевы — Arc), передаётся обработчику по значению.
pub struct GatewayCtx {
    pub pool: SqlitePool,
    pub publisher: SharedChangePublisher,
    /// Кто вызывает: id плагина или `"app"`. Базис для прав (data-rights).
    pub caller: Option<String>,
}

/// Обработчик одного gateway-метода.
#[async_trait]
pub trait MethodHandler: Send + Sync {
    async fn call(&self, args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError>;
}

#[async_trait]
impl<F, Fut> MethodHandler for F
where
    F: Fn(Value, GatewayCtx) -> Fut + Send + Sync,
    Fut: Future<Output = Result<Value, GatewayError>> + Send,
{
    async fn call(&self, args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
        self(args, ctx).await
    }
}

/// Маршрут одного метода плагина: имя + обработчик.
pub struct GwRoute {
    pub method: &'static str,
    pub handler: &'static dyn MethodHandler,
}

/// Реестр маршрутов: plugin_id → (method → маршрут).
pub struct GatewayRouter {
    routes: HashMap<&'static str, HashMap<&'static str, GwRoute>>,
}

impl GatewayRouter {
    /// `plugins` — пары (plugin_id, маршруты плагина).
    pub fn new(plugins: Vec<(&'static str, Vec<GwRoute>)>) -> Self {
        let mut routes: HashMap<&'static str, HashMap<&'static str, GwRoute>> = HashMap::new();
        for (plugin_id, plugin_routes) in plugins {
            let methods = routes.entry(plugin_id).or_default();
            for route in plugin_routes {
                let previous = methods.insert(route.method, route);
                debug_assert!(previous.is_none(), "дубликат gateway-метода у {plugin_id}");
            }
        }
        Self { routes }
    }

    pub fn lookup(&self, plugin_id: &str, method: &str) -> Option<&GwRoute> {
        self.routes.get(plugin_id)?.get(method)
    }

    /// Зарегистрирован ли плагин (есть ли у него маршруты).
    pub fn has_plugin(&self, plugin_id: &str) -> bool {
        self.routes.contains_key(plugin_id)
    }

    /// Имена методов плагина (для теста консистентности с манифестом).
    pub fn methods_of(&self, plugin_id: &str) -> Vec<&'static str> {
        self.routes
            .get(plugin_id)
            .map(|methods| methods.keys().copied().collect())
            .unwrap_or_default()
    }
}

/// Маршруты всех плагинов, собранные один раз при первом вызове.
pub fn router() -> &'static GatewayRouter {
    static ROUTER: OnceLock<GatewayRouter> = OnceLock::new();
    ROUTER.get_or_init(|| GatewayRouter::new(super::registry::all_routes()))
}

/// Ошибка «маршрут не найден»: различаем неизвестный плагин и неизвестный
/// метод зарегистрированного плагина.
pub fn unknown_route_error(plugin_id: &str, method: &str) -> GatewayError {
    if router().has_plugin(plugin_id) {
        GatewayError::new(
            GatewayErrorCode::MethodNotFound,
            format!("Метод '{method}' не открыт плагином '{plugin_id}'"),
        )
    } else {
        GatewayError::new(
            GatewayErrorCode::PluginNotFound,
            format!("Плагин '{plugin_id}' не зарегистрирован в gateway"),
        )
    }
}
