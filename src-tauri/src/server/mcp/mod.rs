//! MCP-сервер Mai: программный доступ для AI-агентов по Model Context Protocol.
//!
//! Транспорт — streamable HTTP поверх общего Axum-сервера (`/mcp`), режим
//! stateless: сессий нет, каждый запрос самодостаточен
//! ([`NeverSessionManager`]). На каждый запрос фабрика собирает свежий
//! [`MaiMcpServer`] — клоны состояния дёшевы (Arc), сервисы собираются
//! per-call по образцу HTTP-эндпоинтов.
//!
//! Слои:
//!
//! - `tools/` — инструменты (модель вызывает), по файлу на инструмент;
//! - `resources/` — MCP-ресурсы `mai://guide/*` (модель читает по URI);
//! - `content/` — проекции содержимого по `typeKey` (не путать с `resources/`);
//! - `render.rs` — рендер ответов: компактный JSON, кап размера, метрики;
//! - `router.rs` — маршруты, `get_info`, объявление ресурсов;
//! - `instructions.md` — текст, отдаваемый агенту в `initialize`.
//!
//! Соглашения слоя — в `MCP.md`. Событийная синхронизация — в
//! `server/endpoints/ENDPOINTS.md` и `app/mai/src/utils/sync/SYNC.md`.
//!
//! v1 read-only: инструменты зовут существующие сервисы и **не мутируют БД**,
//! новой бизнес-логики нет. Мутации — следующая итерация (с публикацией
//! событий, origin=http).

mod content;
mod dto;
mod handler;
mod instructions;
mod render;
mod resources;
mod router;
mod tools;

use std::sync::Arc;

use rmcp::transport::streamable_http_server::{
    session::never::NeverSessionManager, StreamableHttpServerConfig, StreamableHttpService,
};

use super::state::AppState;
pub use handler::MaiMcpServer;
/// MCP-сервис для монтирования в общий роутер: `nest_service("/mcp", ...)`.
pub fn service(state: AppState) -> StreamableHttpService<MaiMcpServer, NeverSessionManager> {
    StreamableHttpService::new(
        move || Ok(MaiMcpServer::new(state.clone())),
        Arc::new(NeverSessionManager::default()),
        // Stateless: сессий нет; простой request-response — JSON вместо SSE.
        StreamableHttpServerConfig::default()
            .with_legacy_session_mode(false)
            .with_json_response(true),
    )
}
