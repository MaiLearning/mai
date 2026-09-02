use std::sync::Arc;

use axum::extract::State;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Json;
use serde::Deserialize;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::{ResourceService, ResourceTypeData};

use super::router::map_error;

#[derive(Deserialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CreateResourceTypeRequest {
    pub key: String,
    pub name: String,
    pub description: Option<String>,
    pub plugin_id: Option<String>,
    pub supported_extensions: Option<Vec<String>>,
}

#[utoipa::path(
    post,
    path = "/resource-types",
    request_body = CreateResourceTypeRequest,
    tag = "resource_types",
    operation_id = "create_resource_type",
    responses(
        (status = 201, description = "Resource type created", body = ResourceTypeData),
        (status = 400, description = "Validation error"),
        (status = 409, description = "Resource type already exists")
    )
)]
pub async fn handler(
    State(state): State<AppState>,
    Json(body): Json<CreateResourceTypeRequest>,
) -> impl IntoResponse {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool));
    let service = ResourceService::new(state.app_paths.clone(), repo, resource_type_repo);

    let data = ResourceTypeData {
        key: body.key,
        name: body.name,
        description: body.description,
        plugin_id: body.plugin_id,
        supported_extensions: body.supported_extensions.unwrap_or_default(),
        created_at: 0,
        updated_at: 0,
    };

    match service.create_type(data).await {
        Ok(resource_type) => {
            (StatusCode::CREATED, Json(serde_json::json!(resource_type))).into_response()
        }
        Err(err) => map_error(err).into_response(),
    }
}
