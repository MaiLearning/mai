//! Манифест gateway task-плагина: read-only данные для потребителей
//! (аналитика и другие плагины).

use crate::plugins::gateway::data::{GatewayManifest, GatewayMethodInfo};

/// Идентификатор плагина в gateway.
pub const PLUGIN_ID: &str = "internal-task";
pub const METHOD_SNAPSHOT: &str = "snapshot";
pub const METHOD_ATTEMPTS: &str = "attempts";

pub fn manifest() -> GatewayManifest {
    GatewayManifest {
        plugin_id: PLUGIN_ID.into(),
        version: "0.1.0".into(),
        methods: vec![
            GatewayMethodInfo::new(
                METHOD_SNAPSHOT,
                "Полный снапшот контента task-ресурса: задачи, сложности, ответы, результаты. Аргументы: { resourceId }.",
            ),
            GatewayMethodInfo::new(
                METHOD_ATTEMPTS,
                "История попыток задачи. Аргументы: { taskId }.",
            ),
        ],
    }
}
