//! Обработчики gateway-методов link-плагина.
//!
//! Единая сигнатура: `(args, ctx)`. Мутации публикуют события (ipc-скоуп)
//! через publisher из контекста, чтения паблишер не используют, но сервис
//! требует его при сборке.

use serde_json::{json, Value};

use super::args::{BacklinksArgs, CourseGraphArgs, CreateArgs, IdArgs, SourceArgs, UpdateArgs};
use crate::plugins::gateway::data::{GatewayError, GatewayErrorCode};
use crate::plugins::gateway::router::GatewayCtx;
use crate::plugins::gateway::support::{parse_args, to_value};
use crate::plugins::link::runtime::build_service;
use crate::plugins::link::service::{CreateLinkData, LinkServiceError, UpdateLinkData};

fn map_service_error(e: LinkServiceError) -> GatewayError {
    match e {
        LinkServiceError::NotFound(msg) => GatewayError::new(GatewayErrorCode::NotFound, msg),
        LinkServiceError::Validation(msg) => GatewayError::new(GatewayErrorCode::BadArgs, msg),
        LinkServiceError::Forbidden(msg) => GatewayError::new(GatewayErrorCode::Forbidden, msg),
        LinkServiceError::Internal(msg) => GatewayError::new(GatewayErrorCode::HandlerError, msg),
    }
}

/// Идентичность вызова: владелец рёбер выводится из caller'а, не из args.
fn caller_id(ctx: &GatewayCtx) -> String {
    ctx.caller.as_deref().unwrap_or("app").to_string()
}

/// Создание ребра: владелец — плагин-caller.
pub async fn create(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: CreateArgs = parse_args(args)?;
    let link = build_service(&ctx.pool, ctx.publisher.clone())
        .create(CreateLinkData {
            source_type: a.source_type,
            source_id: a.source_id,
            target: a.target,
            owner_plugin_id: caller_id(&ctx),
            title: a.title,
            description: a.description,
        })
        .await
        .map_err(map_service_error)?;
    to_value(&link)
}

/// Обновление ребра: только владелец (caller); source не меняется.
pub async fn update(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: UpdateArgs = parse_args(args)?;
    let link = build_service(&ctx.pool, ctx.publisher.clone())
        .update(UpdateLinkData {
            id: a.id,
            owner_plugin_id: caller_id(&ctx),
            target: a.target,
            title: a.title,
            description: a.description,
        })
        .await
        .map_err(map_service_error)?;
    to_value(&link)
}

/// Удаление ребра: только владелец (caller).
pub async fn delete(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: IdArgs = parse_args(args)?;
    build_service(&ctx.pool, ctx.publisher.clone())
        .delete(&a.id, &caller_id(&ctx))
        .await
        .map_err(map_service_error)?;
    Ok(json!({ "deleted": 1 }))
}

/// Контракт владельца источника: удаление всех рёбер источника
/// (любого владельца). Идемпотентно.
pub async fn delete_by_source(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: SourceArgs = parse_args(args)?;
    let removed = build_service(&ctx.pool, ctx.publisher.clone())
        .delete_source_links(&a.source_type, &a.source_id, &caller_id(&ctx))
        .await
        .map_err(map_service_error)?;
    Ok(json!({ "deleted": removed }))
}

/// Рёбра указанного источника.
pub async fn list_by_source(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: SourceArgs = parse_args(args)?;
    let links = build_service(&ctx.pool, ctx.publisher.clone())
        .list_links(&a.source_type, &a.source_id)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}

/// Рёбра, ведущие в указанную цель.
pub async fn list_backlinks(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: BacklinksArgs = parse_args(args)?;
    let links = build_service(&ctx.pool, ctx.publisher.clone())
        .list_backlinks(a.target)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}

/// Рёбра курса (курс-источник и его ресурсы); перед выборкой — sweep.
pub async fn course_graph(args: Value, ctx: GatewayCtx) -> Result<Value, GatewayError> {
    let a: CourseGraphArgs = parse_args(args)?;
    let links = build_service(&ctx.pool, ctx.publisher.clone())
        .list_course_links(&a.course_id)
        .await
        .map_err(map_service_error)?;
    to_value(&links)
}
