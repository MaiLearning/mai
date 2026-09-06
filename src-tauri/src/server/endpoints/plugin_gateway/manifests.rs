use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::plugins::gateway::data::GatewayManifest;
use crate::plugins::gateway::registry::gateway_manifests;

/// Дискавери: манифесты gateway всех плагинов (какие методы открыты).
#[utoipa::path(
    get,
    path = "/plugin/manifests",
    tag = "plugin_gateway",
    operation_id = "plugin_gateway_manifests",
    responses(
        (status = 200, description = "Манифесты всех gateway-плагинов", body = [GatewayManifest])
    )
)]
pub async fn handler() -> impl IntoResponse {
    (StatusCode::OK, Json(serde_json::json!(gateway_manifests())))
}
