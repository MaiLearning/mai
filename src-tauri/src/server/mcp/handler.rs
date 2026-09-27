//! MCP-обработчик Mai: состояние сервера.
//!
//! Клон дёшев (внутри `AppState` — Arc'ы); на каждый запрос фабрика
//! `StreamableHttpService` создаёт свежий экземпляр. Набор инструментов и
//! ресурсов собирается в `router.rs`.

use crate::server::state::AppState;

#[derive(Clone)]
pub struct MaiMcpServer {
    pub(crate) state: AppState,
}

impl MaiMcpServer {
    pub fn new(state: AppState) -> Self {
        Self { state }
    }
}
