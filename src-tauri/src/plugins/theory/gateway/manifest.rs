//! Манифест gateway theory-плагина: read-only доступ к контенту теории.

use super::handlers;
use crate::plugins::gateway::data::{GatewayManifest, GatewayMethodInfo};
use crate::plugins::gateway::router::GwRoute;

/// Идентификатор плагина в gateway.
pub const PLUGIN_ID: &str = "internal-theory";
pub const METHOD_CONTENT: &str = "content";

/// Маршруты методов: имя + обработчик (описания — в манифесте ниже).
pub fn routes() -> Vec<GwRoute> {
    vec![GwRoute {
        method: METHOD_CONTENT,
        handler: &handlers::content,
    }]
}

pub fn manifest() -> GatewayManifest {
    GatewayManifest {
        plugin_id: PLUGIN_ID.into(),
        version: "0.1.0".into(),
        methods: vec![GatewayMethodInfo::new(
            METHOD_CONTENT,
            "Контент теории ресурса (документ редактора); при отсутствии контента возвращается пустой документ без записи в БД. Аргументы: { resourceId }.",
        )],
    }
}
