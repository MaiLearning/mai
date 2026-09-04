use std::sync::Arc;

use serde::Deserialize;
use serde_json::Value;
use sqlx::SqlitePool;

use crate::database::sqlite::repositories::task::SqliteTaskRepository;
use crate::plugins::gateway::data::{
    GatewayError, GatewayErrorCode, GatewayManifest, GatewayMethodInfo,
};
use crate::plugins::task::service::{TaskService, TaskServiceError};

/// Идентификатор плагина в gateway.
pub const PLUGIN_ID: &str = "internal-task";
pub const METHOD_SNAPSHOT: &str = "snapshot";
pub const METHOD_ATTEMPTS: &str = "attempts";

/// Манифест gateway task-плагина: read-only данные для потребителей
/// (аналитика и другие плагины).
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

fn build_service(pool: &SqlitePool) -> TaskService {
    let task_repo = Arc::new(SqliteTaskRepository::new(pool.clone()));
    TaskService::new(task_repo)
}

fn parse_args<T: for<'de> Deserialize<'de>>(args: Value) -> Result<T, GatewayError> {
    serde_json::from_value(args).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::BadArgs,
            format!("Некорректные аргументы: {}", e),
        )
    })
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
    serde_json::to_value(data).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::HandlerError,
            format!("Ошибка сериализации: {}", e),
        )
    })
}

/// История попыток задачи.
pub async fn attempts(args: Value, pool: &SqlitePool) -> Result<Value, GatewayError> {
    let args: AttemptsArgs = parse_args(args)?;
    let data = build_service(pool)
        .list_task_attempts(&args.task_id)
        .await
        .map_err(map_service_error)?;
    serde_json::to_value(data).map_err(|e| {
        GatewayError::new(
            GatewayErrorCode::HandlerError,
            format!("Ошибка сериализации: {}", e),
        )
    })
}
