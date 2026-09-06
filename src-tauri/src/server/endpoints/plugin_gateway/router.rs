use axum::http::StatusCode;
use axum::routing::{get, post};
use axum::{Json, Router};

use crate::plugins::gateway::data::{GatewayError, GatewayErrorCode};
use crate::server::state::AppState;

use super::{call, manifests};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/manifests", get(manifests::handler))
        .route("/{plugin_id}/{method}", post(call::handler))
}

pub fn map_error(err: GatewayError) -> (StatusCode, Json<serde_json::Value>) {
    let status = match err.code {
        GatewayErrorCode::PluginNotFound
        | GatewayErrorCode::MethodNotFound
        | GatewayErrorCode::NotFound => StatusCode::NOT_FOUND,
        GatewayErrorCode::BadArgs => StatusCode::BAD_REQUEST,
        GatewayErrorCode::Forbidden => StatusCode::FORBIDDEN,
        GatewayErrorCode::HandlerError => StatusCode::INTERNAL_SERVER_ERROR,
    };
    (status, Json(serde_json::json!(err)))
}
