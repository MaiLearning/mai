use super::data::GatewayManifest;
use crate::plugins::task::gateway;

/// Манифесты gateway всех internal-плагинов.
///
/// Плагин с gateway-методами: добавь манифест сюда,
/// обработчики — в `dispatch.rs`, константы — в `<plugin>/gateway.rs`.
pub fn gateway_manifests() -> Vec<GatewayManifest> {
    vec![gateway::manifest()]
}

/// Зарегистрирован ли плагин в gateway.
pub fn has_plugin(plugin_id: &str) -> bool {
    gateway_manifests().iter().any(|m| m.plugin_id == plugin_id)
}
