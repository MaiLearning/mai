//! Обработчики gateway-методов theory-плагина.
//!
//! Единая сигнатура: `(args, ctx)`. Theory-сервис событий не публикует,
//! поэтому publisher из контекста не используется.

use serde::Deserialize;
use serde_json::Value;

use crate::plugins::gateway::data::{GatewayError, GatewayErrorCode};
use crate::plugins::gateway::router::GatewayCtx;
use crate::plugins::gateway::support::{parse_args, to_value};
use crate::plugins::theory::runtime::build_service;
use crate::plugins::theory::service::TheoryServiceError;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ContentArgs {
    resource_id: String,
}

fn map_service_error(e: TheoryServiceError) -> GatewayError {
    match e {
        TheoryServiceError::NotFound(msg) => GatewayError::new(GatewayErrorCode::NotFound, msg),
        TheoryServiceError::Validation(msg) => GatewayError::new(GatewayErrorCode::BadArgs, msg),
        TheoryServiceError::Internal(msg) => GatewayError::new(GatewayErrorCode::HandlerError, msg),
    }
}

/// Контент теории ресурса (пустой корень создаётся при отсутствии).
pub async fn content(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let args: ContentArgs = parse_args(args)?;
    let data = build_service(&ctx.pool)
        .get(&args.resource_id)
        .await
        .map_err(map_service_error)?;
    to_value(&data)
}
