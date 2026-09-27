//! Сборка MCP-сервера Mai: маршруты инструментов и ресурсы.
//!
//! Здесь только схемы и вызовы — вся логика инструмента лежит в своём файле
//! `tools/`, рендер — в `render.rs`. Описание инструмента (`#[tool(description)]`)
//! живёт здесь же: атрибут макроса принимает только строковый литерал, поэтому
//! вынести его в `tools/` нельзя.
//!
//! Ресурсы — примитив «прочитать по URI», инструменты — «сделать вызов».
//! Документация (глоссарий, воркфлоу, форматы) лежит в `resources/`, потому
//! что агент читает её по необходимости, а не на каждой сессии.

use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::{
    CallToolResult, Implementation, ListResourcesResult, PaginatedRequestParams,
    ReadResourceRequestParams, ReadResourceResponse, ServerCapabilities, ServerInfo,
};
use rmcp::service::RequestContext;
use rmcp::{tool, tool_handler, tool_router, ErrorData, RoleServer, ServerHandler};

use super::handler::MaiMcpServer;
use super::{instructions, resources, tools};

#[tool_router]
impl MaiMcpServer {
    #[tool(
        description = "Список всех курсов кратко: id, имя, описание, теги, статус.
Точка старта: отсюда берётся courseId для mai_course_outline и mai_get_content.
Даты и цвета карточки не отдаются — они не нужны для навигации."
    )]
    async fn mai_list_courses(&self) -> Result<CallToolResult, ErrorData> {
        tools::list_courses::run(&self.state).await
    }

    #[tool(
        description = "Карточка одного курса по courseId: id, имя, описание, теги, статус.
Статус: draft | in_progress | completed. Используй, когда нужен контекст курса,
а не его состав — за составом иди в mai_course_outline."
    )]
    async fn mai_get_course(
        &self,
        Parameters(args): Parameters<tools::CourseIdArgs>,
    ) -> Result<CallToolResult, ErrorData> {
        tools::get_course::run(&self.state, args).await
    }

    #[tool(
        description = "Оглавление курса текстовым деревом — основная навигация.
Одна строка на узел: отступ = глубина, [dir <id>] или [res <id> <typeKey> upd:<мс>].
Отсюда берутся resourceId для mai_get_resource, mai_get_content и mai_search.
Аргументы: courseId (обязателен), rootId (директория — её поддерево, ресурс —
путь от корня до него; по умолчанию корень курса), depth (по умолчанию 2),
typeKeys (только эти типы ресурсов; директории остаются всегда), maxNodes
(по умолчанию 200). При усечении в выводе стоит подсказка — сужай выборку,
а не читай остальное подряд."
    )]
    async fn mai_course_outline(
        &self,
        Parameters(args): Parameters<tools::course_outline::Args>,
    ) -> Result<CallToolResult, ErrorData> {
        tools::course_outline::run(&self.state, args).await
    }

    #[tool(description = "Карточка ресурса по resourceId.
detail: brief (по умолчанию) — id, courseId, typeKey, name, updatedAt, без
metadata и файлов; full — вся запись ресурса, включая непрозрачное поле metadata
и список файлов. Аргументы: resourceId, detail.")]
    async fn mai_get_resource(
        &self,
        Parameters(args): Parameters<tools::get_resource::Args>,
    ) -> Result<CallToolResult, ErrorData> {
        tools::get_resource::run(&self.state, args).await
    }

    #[tool(description = "Содержимое ресурса по resourceId.
format: text (по умолчанию) — читаемый текст, самый дешёвый вариант;
json — исходный документ без потерь, когда важна структура. Формат задаёт
typeKey ресурса: theory — документ редактора, task — JSON со списком задач и
прогрессом, code — JSON с файлами. Содержимого ещё нет — вернётся not found,
это не ошибка вызова, а отсутствие данных. Аргументы: resourceId, format.")]
    async fn mai_get_content(
        &self,
        Parameters(args): Parameters<tools::get_content::Args>,
    ) -> Result<CallToolResult, ErrorData> {
        tools::get_content::run(&self.state, args).await
    }

    #[tool(description = "Поиск по именам узлов и содержимому ресурсов курса.
Отдаёт совпадения с resourceId и контекстом, а не тело ресурса — этим дешевле
читать содержимое целиком ради одного факта. Ищи здесь, а не вызывай
mai_get_content «на авось». Аргументы: query, courseId (не задан — все курсы),
typeKeys, maxResults (по умолчанию 20).")]
    async fn mai_search(
        &self,
        Parameters(args): Parameters<tools::search::Args>,
    ) -> Result<CallToolResult, ErrorData> {
        tools::search::run(&self.state, args).await
    }

    #[tool(
        description = "Установленные плагины кратко: id, имя, версия, включён ли,
внутренний или внешний. Нужен, чтобы понять, какой плагин владеет типом
ресурса. Аргументов нет."
    )]
    async fn mai_list_plugins(&self) -> Result<CallToolResult, ErrorData> {
        tools::list_plugins::run(&self.state).await
    }
}

/// `get_info` пишется вручную, а не через атрибут `#[tool_handler(instructions
/// = …)]`, по двум причинам:
///
/// 1. атрибут принимает только строковый литерал — `include_str!` в него не
///    передать, а инструкции лежат в `instructions.md`;
/// 2. макрос объявляет capability только `tools` — без него сервер не сообщит
///    клиенту про ресурсы и они останутся невидимыми.
#[tool_handler]
impl ServerHandler for MaiMcpServer {
    fn get_info(&self) -> ServerInfo {
        ServerInfo::new(
            ServerCapabilities::builder()
                .enable_tools()
                .enable_resources()
                .build(),
        )
        .with_server_info(Implementation::new("mai", env!("CARGO_PKG_VERSION")))
        .with_instructions(instructions::SERVER.to_string())
    }

    async fn list_resources(
        &self,
        _request: Option<PaginatedRequestParams>,
        _context: RequestContext<RoleServer>,
    ) -> Result<ListResourcesResult, ErrorData> {
        Ok(resources::list())
    }

    async fn read_resource(
        &self,
        request: ReadResourceRequestParams,
        _context: RequestContext<RoleServer>,
    ) -> Result<ReadResourceResponse, ErrorData> {
        Ok(resources::read(&request.uri)?.into())
    }
}
