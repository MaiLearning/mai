use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::{ResourceService, ResourceTypeData};

use super::router::map_error;

#[utoipa::path(
    delete,
    path = "/resource-types/{key}",
    tag = "resource_types",
    operation_id = "delete_resource_type",
    params(("key" = String, Path, description = "Resource type key")),
    responses(
        (status = 200, description = "Resource type deleted", body = ResourceTypeData),
        (status = 404, description = "Resource type not found")
    )
)]
pub async fn handler(State(state): State<AppState>, Path(key): Path<String>) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool));
    let service = ResourceService::new(
        state.app_paths.clone(),
        repo,
        resource_type_repo,
        state.publisher.clone(),
    );

    match service.delete_type(&key).await {
        Ok(resource_type) => {
            (StatusCode::OK, Json(serde_json::json!(resource_type))).into_response()
        }
        Err(err) => map_error(err).into_response(),
    }
}
