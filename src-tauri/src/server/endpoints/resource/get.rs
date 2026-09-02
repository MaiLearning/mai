use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::{ResourceData, ResourceService};

use super::router::map_error;

#[utoipa::path(
    get,
    path = "/resources/{id}",
    tag = "resources",
    operation_id = "get_resource",
    params(("id" = String, Path, description = "Resource ID")),
    responses(
        (status = 200, description = "Resource found", body = ResourceData),
        (status = 404, description = "Resource not found")
    )
)]
pub async fn handler(State(state): State<AppState>, Path(id): Path<String>) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool));
    let service = ResourceService::new(
        state.app_paths.clone(),
        repo,
        resource_type_repo,
        state.publisher.clone(),
    );

    match service.get(&id).await {
        Ok(resource) => (StatusCode::OK, Json(serde_json::json!(resource))).into_response(),
        Err(err) => map_error(err).into_response(),
    }
}
