use axum::{routing::get, Router};
use utoipa_swagger_ui::SwaggerUi;

use utoipa::OpenApi;

use super::endpoints;
use super::mcp;
use super::openapi::ApiDoc;
use super::state::AppState;

pub fn router(state: AppState) -> Router {
    let mcp_service = mcp::service(state.clone());
    Router::new()
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/health", get(endpoints::health::health))
        .nest("/plugin", endpoints::plugin_gateway::router())
        .nest("/plugins", endpoints::plugin::router())
        .nest("/courses", endpoints::course::router())
        .nest("/structures", endpoints::structure::router())
        .nest("/resources", endpoints::resource::router())
        .nest("/resource-types", endpoints::resource_type::router())
        .nest_service("/mcp", mcp_service)
        .with_state(state)
}
