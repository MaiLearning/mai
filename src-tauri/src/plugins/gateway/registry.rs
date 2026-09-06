use super::data::GatewayManifest;
use super::router::GwRoute;
use crate::plugins::link::gateway as link_gateway;
use crate::plugins::task::gateway;
use crate::plugins::theory::gateway as theory_gateway;

/// Манифесты gateway всех internal-плагинов (для дискавери).
///
/// Новый gateway-плагин: манифест и `routes()` — в `<plugin>/gateway/manifest.rs`,
/// и одна строка в `all_routes()` ниже.
pub fn gateway_manifests() -> Vec<GatewayManifest> {
    vec![
        gateway::manifest(),
        link_gateway::manifest(),
        theory_gateway::manifest(),
    ]
}

/// Маршруты всех плагинов: единственное место перечисления плагинов в ядре.
pub fn all_routes() -> Vec<(&'static str, Vec<GwRoute>)> {
    vec![
        (gateway::PLUGIN_ID, gateway::routes()),
        (link_gateway::PLUGIN_ID, link_gateway::routes()),
        (theory_gateway::PLUGIN_ID, theory_gateway::routes()),
    ]
}
