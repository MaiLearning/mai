//! Обработчики gateway-методов link-плагина.
//!
//! Единая сигнатура: `(args, caller, publisher, pool)`. Мутации публикуют
//! события (ipc-скоуп), чтения паблишер не используют, но получают его —
//! сервис требует его при сборке.

use serde_json::{json, Value};
use sqlx::SqlitePool;

use super::args::{BacklinksArgs, CourseGraphArgs, CreateArgs, IdArgs, SourceArgs, UpdateArgs};
use crate::plugins::gateway::data::{GatewayError, GatewayErrorCode};
use crate::plugins::gateway::support::{parse_args, to_value};
use crate::plugins::link::runtime::build_service;
use crate::plugins::link::service::{CreateLinkData, LinkServiceError, UpdateLinkData};
use crate::services::events::SharedChangePublisher;

fn map_service_error(e: LinkServiceError) -> GatewayError {
    match e {
        LinkServiceError::NotFound(msg) => GatewayError::new(GatewayErrorCode::NotFound, msg),
        LinkServiceError::Validation(msg) => GatewayError::new(GatewayErrorCode::BadArgs, msg),
        LinkServiceError::Forbidden(msg) => GatewayError::new(GatewayErrorCode::Forbidden, msg),
        LinkServiceError::Internal(msg) => GatewayError::new(GatewayErrorCode::HandlerError, msg),
    }
}

/// Идентичность вызова: владелец рёбер выводится из caller'а, не из args.
fn caller_id(caller: Option<&str>) -> String {
    caller.unwrap_or("app").to_string()
}

/// Создание ребра: владелец — плагин-caller.
pub async fn create(
    args: Value,
    caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: CreateArgs = parse_args(args)?;
    let link = build_service(pool, publisher)
        .create(CreateLinkData {
            source_type: a.source_type,
            source_id: a.source_id,
            target: a.target,
            owner_plugin_id: caller_id(caller),
            title: a.title,
            description: a.description,
        })
        .await
        .map_err(map_service_error)?;
    to_value(&link)
}

/// Обновление ребра: только владелец (caller); source не меняется.
pub async fn update(
    args: Value,
    caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: UpdateArgs = parse_args(args)?;
    let link = build_service(pool, publisher)
        .update(UpdateLinkData {
            id: a.id,
            owner_plugin_id: caller_id(caller),
            target: a.target,
            title: a.title,
            description: a.description,
        })
        .await
        .map_err(map_service_error)?;
    to_value(&link)
}

/// Удаление ребра: только владелец (caller).
pub async fn delete(
    args: Value,
    caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: IdArgs = parse_args(args)?;
    build_service(pool, publisher)
        .delete(&a.id, &caller_id(caller))
        .await
        .map_err(map_service_error)?;
    Ok(json!({ "deleted": 1 }))
}

/// Контракт владельца источника: удаление всех рёбер источника
/// (любого владельца). Идемпотентно.
pub async fn delete_by_source(
    args: Value,
    caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: SourceArgs = parse_args(args)?;
    let removed = build_service(pool, publisher)
        .delete_source_links(&a.source_type, &a.source_id, &caller_id(caller))
        .await
        .map_err(map_service_error)?;
    Ok(json!({ "deleted": removed }))
}

/// Рёбра указанного источника.
pub async fn list_by_source(
    args: Value,
    _caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: SourceArgs = parse_args(args)?;
    let links = build_service(pool, publisher)
        .list_links(&a.source_type, &a.source_id)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}

/// Рёбра, ведущие в указанную цель.
pub async fn list_backlinks(
    args: Value,
    _caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: BacklinksArgs = parse_args(args)?;
    let links = build_service(pool, publisher)
        .list_backlinks(a.target)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}

/// Рёбра курса (курс-источник и его ресурсы); перед выборкой — sweep.
pub async fn course_graph(
    args: Value,
    _caller: Option<&str>,
    publisher: SharedChangePublisher,
    pool: &SqlitePool,
) -> Result<Value, GatewayError> {
    let a: CourseGraphArgs = parse_args(args)?;
    let links = build_service(pool, publisher)
        .list_course_links(&a.course_id)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}
