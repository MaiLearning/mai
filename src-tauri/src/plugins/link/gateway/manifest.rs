//! Манифест gateway link-плагина: мутации (владелец — caller), контрактный
//! `deleteBySource` и read-методы для потребителей (панели, аналитика).

use super::handlers;
use crate::plugins::gateway::data::{GatewayManifest, GatewayMethodInfo};
use crate::plugins::gateway::router::GwRoute;

/// Идентификатор плагина в gateway.
pub const PLUGIN_ID: &str = "internal-link";
pub const METHOD_CREATE: &str = "create";
pub const METHOD_UPDATE: &str = "update";
pub const METHOD_DELETE: &str = "delete";
pub const METHOD_DELETE_BY_SOURCE: &str = "deleteBySource";
pub const METHOD_LIST_BY_SOURCE: &str = "listBySource";
pub const METHOD_LIST_BACKLINKS: &str = "listBacklinks";
pub const METHOD_COURSE_GRAPH: &str = "courseGraph";

/// Маршруты методов: имя + обработчик (описания — в манифесте ниже).
pub fn routes() -> Vec<GwRoute> {
    vec![
        GwRoute {
            method: METHOD_CREATE,
            handler: &handlers::create,
        },
        GwRoute {
            method: METHOD_UPDATE,
            handler: &handlers::update,
        },
        GwRoute {
            method: METHOD_DELETE,
            handler: &handlers::delete,
        },
        GwRoute {
            method: METHOD_DELETE_BY_SOURCE,
            handler: &handlers::delete_by_source,
        },
        GwRoute {
            method: METHOD_LIST_BY_SOURCE,
            handler: &handlers::list_by_source,
        },
        GwRoute {
            method: METHOD_LIST_BACKLINKS,
            handler: &handlers::list_backlinks,
        },
        GwRoute {
            method: METHOD_COURSE_GRAPH,
            handler: &handlers::course_graph,
        },
    ]
}

pub fn manifest() -> GatewayManifest {
    GatewayManifest {
        plugin_id: PLUGIN_ID.into(),
        version: "0.1.0".into(),
        methods: vec![
            GatewayMethodInfo::new(
                METHOD_CREATE,
                "Создание ребра; владелец — плагин-caller. Аргументы: { sourceType, sourceId, target, title?, description? }.",
            ),
            GatewayMethodInfo::new(
                METHOD_UPDATE,
                "Обновление ребра (target, title, description): только владелец (caller). Аргументы: { id, target, title?, description? }.",
            ),
            GatewayMethodInfo::new(
                METHOD_DELETE,
                "Удаление ребра: только владелец (caller). Аргументы: { id }.",
            ),
            GatewayMethodInfo::new(
                METHOD_DELETE_BY_SOURCE,
                "Контракт владельца источника: «удалил свою сущность — вызови»; удаляет все её рёбра (любого владельца), идемпотентно. Аргументы: { sourceType, sourceId }. Ответ: { deleted }.",
            ),
            GatewayMethodInfo::new(
                METHOD_LIST_BY_SOURCE,
                "Рёбра указанного источника. Аргументы: { sourceType, sourceId }.",
            ),
            GatewayMethodInfo::new(
                METHOD_LIST_BACKLINKS,
                "Рёбра, ведущие в указанную цель. Аргументы: { target }.",
            ),
            GatewayMethodInfo::new(
                METHOD_COURSE_GRAPH,
                "Рёбра курса (курс-источник и его ресурсы); перед выборкой — sweep мёртвых источников. Аргументы: { courseId }.",
            ),
        ],
    }
}
