use std::sync::Arc;

use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::resource_type::ResourceTypeRepository;
use crate::database::repository::RepoError;
use crate::services::resource::data::{ResourceData, ResourceTypeData};
use crate::utils::paths::{AppPaths, FsError};

use super::exceptions::ResourceServiceError;
use super::rules;

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> ResourceServiceError {
    match e {
        RepoError::NotFound(msg) => ResourceServiceError::NotFound(msg),
        RepoError::Conflict(msg) => ResourceServiceError::AlreadyExists(msg),
        RepoError::Db(msg) => {
            ResourceServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

fn map_fs_error(e: FsError, context: &str) -> ResourceServiceError {
    match e {
        FsError::NotFound(msg) => ResourceServiceError::NotFound(msg),
        FsError::AlreadyExists(msg) => ResourceServiceError::AlreadyExists(msg),
        FsError::Io(e) => {
            ResourceServiceError::Internal(format!("FS error while {}: {}", context, e))
        }
    }
}

pub struct ResourceService {
    app_paths: AppPaths,
    resource_repo: Arc<dyn ResourceRepository>,
    resource_type_repo: Arc<dyn ResourceTypeRepository>,
}

impl ResourceService {
    pub fn new(
        app_paths: AppPaths,
        resource_repo: Arc<dyn ResourceRepository>,
        resource_type_repo: Arc<dyn ResourceTypeRepository>,
    ) -> Self {
        Self {
            app_paths,
            resource_repo,
            resource_type_repo,
        }
    }

    // ── Типы ресурсов ──────────────────────────────────

    pub async fn list_types(&self) -> Result<Vec<ResourceTypeData>, ResourceServiceError> {
        self.resource_type_repo
            .all()
            .await
            .map_err(|e| map_repo_error(e, "list resource types"))
    }

    pub async fn get_type(&self, key: &str) -> Result<ResourceTypeData, ResourceServiceError> {
        let resolved_key = rules::validate_resource_type_key(key)?;
        self.resource_type_repo
            .get(&resolved_key)
            .await
            .map_err(|e| map_repo_error(e, &format!("get resource type '{}'", resolved_key)))
    }

    pub async fn create_type(
        &self,
        data: ResourceTypeData,
    ) -> Result<ResourceTypeData, ResourceServiceError> {
        let key = rules::validate_resource_type_key(&data.key)?;
        let name = rules::validate_resource_type_name(&data.name)?;
        let description = match &data.description {
            Some(d) => Some(rules::validate_resource_type_description(d)?),
            None => None,
        };
        rules::validate_resource_type_extensions(&data.supported_extensions)?;

        let now = now_millis();
        let normalized = ResourceTypeData {
            key,
            name,
            description,
            plugin_id: data.plugin_id,
            supported_extensions: data.supported_extensions,
            created_at: now,
            updated_at: now,
        };

        self.resource_type_repo
            .create(normalized)
            .await
            .map_err(|e| map_repo_error(e, "create resource type"))
    }

    pub async fn update_type(
        &self,
        data: ResourceTypeData,
    ) -> Result<ResourceTypeData, ResourceServiceError> {
        let key = rules::validate_resource_type_key(&data.key)?;
        let name = rules::validate_resource_type_name(&data.name)?;
        let description = match &data.description {
            Some(d) => Some(rules::validate_resource_type_description(d)?),
            None => None,
        };
        rules::validate_resource_type_extensions(&data.supported_extensions)?;

        let normalized = ResourceTypeData {
            key,
            name,
            description,
            plugin_id: data.plugin_id,
            supported_extensions: data.supported_extensions,
            created_at: data.created_at,
            updated_at: now_millis(),
        };

        self.resource_type_repo
            .update(normalized)
            .await
            .map_err(|e| map_repo_error(e, "update resource type"))
    }

    pub async fn delete_type(&self, key: &str) -> Result<ResourceTypeData, ResourceServiceError> {
        let resolved_key = rules::validate_resource_type_key(key)?;
        self.resource_type_repo
            .delete(&resolved_key)
            .await
            .map_err(|e| map_repo_error(e, &format!("delete resource type '{}'", resolved_key)))
    }

    // ── Ресурсы ────────────────────────────────────────

    pub async fn list(&self) -> Result<Vec<ResourceData>, ResourceServiceError> {
        self.resource_repo
            .all()
            .await
            .map_err(|e| map_repo_error(e, "list resources"))
    }

    pub async fn get(&self, id: &str) -> Result<ResourceData, ResourceServiceError> {
        let resolved_id = rules::validate_resource_id(id)?;
        self.resource_repo
            .get(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get resource '{}'", resolved_id)))
    }

    pub async fn create(&self, data: ResourceData) -> Result<ResourceData, ResourceServiceError> {
        let id = rules::validate_resource_id(&data.id)?;
        let course_id = rules::validate_resource_course_id(&data.course_id)?;
        let name = rules::validate_resource_name(&data.name)?;

        let normalized = ResourceData {
            id: id.clone(),
            course_id: course_id.clone(),
            type_key: data.type_key,
            name,
            metadata: data.metadata,
            files: data.files,
            created_at: now_millis(),
            updated_at: now_millis(),
        };

        let result = self
            .resource_repo
            .create(normalized)
            .await
            .map_err(|e| map_repo_error(e, "create resource"))?;

        // ФС: создаём директорию ресурса
        self.app_paths
            .create_resource_dir(&course_id, &id)
            .map_err(|e| map_fs_error(e, "create resource dir"))?;

        Ok(result)
    }

    pub async fn update(&self, data: ResourceData) -> Result<ResourceData, ResourceServiceError> {
        let id = rules::validate_resource_id(&data.id)?;
        let name = rules::validate_resource_name(&data.name)?;

        let id_for_err = id.clone();

        let normalized = ResourceData {
            id,
            course_id: data.course_id,
            type_key: data.type_key,
            name,
            metadata: data.metadata,
            files: data.files,
            created_at: data.created_at,
            updated_at: now_millis(),
        };

        self.resource_repo
            .update(normalized)
            .await
            .map_err(|e| map_repo_error(e, &format!("update resource '{}'", id_for_err)))
    }

    pub async fn delete(&self, id: &str) -> Result<ResourceData, ResourceServiceError> {
        let resolved_id = rules::validate_resource_id(id)?;

        // Получаем данные ресурса перед удалением (нужен course_id для ФС)
        let data = self
            .resource_repo
            .get(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get resource '{}'", resolved_id)))?;

        let result = self
            .resource_repo
            .delete(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("delete resource '{}'", resolved_id)))?;

        // ФС: удаляем директорию ресурса
        self.app_paths
            .remove_resource_dir(&data.course_id, &resolved_id)
            .map_err(|e| map_fs_error(e, "remove resource dir"))?;

        Ok(result)
    }
}
