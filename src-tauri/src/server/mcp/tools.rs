//! Read-only MCP tools поверх существующих сервисов Mai (v1).

use std::sync::Arc;

use rmcp::handler::server::wrapper::Parameters;
use rmcp::model::CallToolResult;
use rmcp::{tool, tool_handler, tool_router, ErrorData, ServerHandler};
use schemars::JsonSchema;
use serde::Deserialize;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::plugins::theory::runtime::build_service as build_theory_service;
use crate::services::course::CourseService;
use crate::services::plugin::PluginService;
use crate::services::resource::ResourceService;
use crate::services::structure::StructureService;

use super::handler::{json_tool, tool_error, MaiMcpServer};

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct CourseIdArgs {
    /// Идентификатор курса (UUID)
    pub course_id: String,
}

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct ResourceIdArgs {
    /// Идентификатор ресурса (UUID)
    pub resource_id: String,
}

#[tool_router]
impl MaiMcpServer {
    #[tool(description = "Список всех курсов: id, название, описание, теги, статус")]
    async fn list_courses(&self) -> Result<CallToolResult, ErrorData> {
        let repo = Arc::new(SqliteCourseRepository::new(self.state.pool.clone()));
        let service = CourseService::new(
            self.state.app_paths.clone(),
            repo,
            self.state.publisher.clone(),
        );
        match service.all().await {
            Ok(courses) => json_tool(&courses),
            Err(e) => tool_error(e),
        }
    }

    #[tool(description = "Один курс по id")]
    async fn get_course(
        &self,
        Parameters(CourseIdArgs { course_id }): Parameters<CourseIdArgs>,
    ) -> Result<CallToolResult, ErrorData> {
        let repo = Arc::new(SqliteCourseRepository::new(self.state.pool.clone()));
        let service = CourseService::new(
            self.state.app_paths.clone(),
            repo,
            self.state.publisher.clone(),
        );
        match service.get(&course_id).await {
            Ok(course) => json_tool(&course),
            Err(e) => tool_error(e),
        }
    }

    #[tool(description = "Дерево содержимого курса (узлы и встроенные ресурсы)")]
    async fn get_course_structure(
        &self,
        Parameters(CourseIdArgs { course_id }): Parameters<CourseIdArgs>,
    ) -> Result<CallToolResult, ErrorData> {
        let repo = Arc::new(SqliteStructureRepository::new(self.state.pool.clone()));
        let dir_repo = Arc::new(SqliteDirectoryRepository::new(self.state.pool.clone()));
        let resource_repo = Arc::new(SqliteResourceRepository::new(self.state.pool.clone()));
        let service =
            StructureService::new(repo, dir_repo, resource_repo, self.state.publisher.clone());
        match service.get_structure(&course_id).await {
            Ok(nodes) => json_tool(&nodes),
            Err(e) => tool_error(e),
        }
    }

    #[tool(description = "Материал курса (ресурс) по id: тип, имя, метаданные, файлы")]
    async fn get_resource(
        &self,
        Parameters(ResourceIdArgs { resource_id }): Parameters<ResourceIdArgs>,
    ) -> Result<CallToolResult, ErrorData> {
        let repo = Arc::new(SqliteResourceRepository::new(self.state.pool.clone()));
        let rt_repo = Arc::new(SqliteResourceTypeRepository::new(self.state.pool.clone()));
        let service = ResourceService::new(
            self.state.app_paths.clone(),
            repo,
            rt_repo,
            self.state.publisher.clone(),
        );
        match service.get(&resource_id).await {
            Ok(resource) => json_tool(&resource),
            Err(e) => tool_error(e),
        }
    }

    #[tool(
        description = "Контент теории ресурса (Lexical-состояние редактора); ошибка, если контент ещё не создан — инструмент ничего не записывает"
    )]
    async fn get_theory(
        &self,
        Parameters(ResourceIdArgs { resource_id }): Parameters<ResourceIdArgs>,
    ) -> Result<CallToolResult, ErrorData> {
        let service = build_theory_service(&self.state.pool);
        match service.get(&resource_id).await {
            Ok(content) => json_tool(&content),
            Err(e) => tool_error(e),
        }
    }

    #[tool(description = "Список установленных плагинов: id, имя, версия, включён ли")]
    async fn list_plugins(&self) -> Result<CallToolResult, ErrorData> {
        let repo = Arc::new(SqlitePluginRepository::new(self.state.pool.clone()));
        let service = PluginService::new(
            self.state.app_paths.clone(),
            repo,
            self.state.publisher.clone(),
        );
        match service.list().await {
            Ok(plugins) => json_tool(&plugins),
            Err(e) => tool_error(e),
        }
    }
}

#[tool_handler(
    name = "mai",
    version = "0.1.0",
    instructions = "Read-only доступ к данным Mai: курсы, структура курса, ресурсы, контент теории, установленные плагины."
)]
impl ServerHandler for MaiMcpServer {}
