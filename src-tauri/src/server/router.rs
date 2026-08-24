use axum::{routing::get, Router};
use sqlx::SqlitePool;
use utoipa_swagger_ui::SwaggerUi;

use utoipa::OpenApi;

use crate::utils::paths::AppPaths;

use super::endpoints;
use super::openapi::ApiDoc;

pub fn router(pool: SqlitePool, app_paths: AppPaths) -> Router {
    Router::new()
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .route("/health", get(endpoints::health::health))
        .nest("/plugins", endpoints::plugin::router())
        .nest("/courses", endpoints::course::router())
        .nest("/structures", endpoints::structure::router())
        .nest("/resources", endpoints::resource::router())
        .nest("/resource-types", endpoints::resource_type::router())
        .with_state((pool, app_paths))
}
