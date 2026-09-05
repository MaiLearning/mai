//! Обработчики gateway-методов task-плагина.

use serde::Deserialize;
use serde_json::Value;
use sqlx::SqlitePool;

use crate::plugins::gateway::data::{GatewayError, GatewayErrorCode};
use crate::plugins::gateway::support::{parse_args, to_value};
use crate::plugins::task::runtime::build_service;
use crate::plugins::task::service::TaskServiceError;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SnapshotArgs {
    resource_id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct AttemptsArgs {
    task_id: String,
}

fn map_service_error(e: TaskServiceError) -> GatewayError {
    match e {
        TaskServiceError::NotFound(msg) => GatewayError::new(GatewayErrorCode::NotFound, msg),
        TaskServiceError::Validation(msg) => GatewayError::new(GatewayErrorCode::BadArgs, msg),
        TaskServiceError::Internal(msg) => GatewayError::new(GatewayErrorCode::HandlerError, msg),
    }
}

/// Снапшот контента task-ресурса (корень создаётся при отсутствии).
pub async fn snapshot(args: Value, pool: &SqlitePool) -> Result<Value, GatewayError> {
    let args: SnapshotArgs = parse_args(args)?;
    let data = build_service(pool)
        .snapshot(&args.resource_id)
        .await
        .map_err(map_service_error)?;
    to_value(&data)
}

/// История попыток задачи.
pub async fn attempts(args: Value, pool: &SqlitePool) -> Result<Value, GatewayError> {
    let args: AttemptsArgs = parse_args(args)?;
    let data = build_service(pool)
        .list_task_attempts(&args.task_id)
        .await
        .map_err(map_service_error)?;
    to_value(&data)
}
