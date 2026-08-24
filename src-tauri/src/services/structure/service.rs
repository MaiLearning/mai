use std::sync::Arc;

use crate::database::repository::directory::DirectoryRepository;
use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::structure::StructureRepository;
use crate::database::repository::RepoError;
use crate::services::structure::{DirectoryData, StructureNodeFlat};

use super::exceptions::StructureServiceError;
use super::rules::StructureRules;

pub struct StructureService {
    repo: Arc<dyn StructureRepository>,
    dir_repo: Arc<dyn DirectoryRepository>,
    resource_repo: Arc<dyn ResourceRepository>,
}

impl StructureService {
    pub fn new(
        repo: Arc<dyn StructureRepository>,
        dir_repo: Arc<dyn DirectoryRepository>,
        resource_repo: Arc<dyn ResourceRepository>,
    ) -> Self {
        Self {
            repo,
            dir_repo,
            resource_repo,
        }
    }

    // ------------------------------------------------------------------
    // get_structure
    // ------------------------------------------------------------------
    pub async fn get_structure(
        &self,
        course_id: &str,
    ) -> Result<Vec<StructureNodeFlat>, StructureServiceError> {
        let resolved = StructureRules::validate_course_id(course_id)?;
        self.repo
            .get_structure(&resolved)
            .await
            .map_err(|e| map_repo_error(e, &format!("get structure for course '{}'", resolved)))
    }

    // ------------------------------------------------------------------
    // get_structure_node_by_resource
    // ------------------------------------------------------------------
    pub async fn get_structure_node_by_resource(
        &self,
        resource_id: &str,
    ) -> Result<StructureNodeFlat, StructureServiceError> {
        let resolved_id = StructureRules::validate_resource_id(resource_id)?;

        self.repo
            .get_structure_node_by_resource(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get node by resource '{}'", resolved_id)))
    }

    // ------------------------------------------------------------------
    // get_node
    // ------------------------------------------------------------------
    pub async fn get_node(
        &self,
        node_id: &str,
    ) -> Result<StructureNodeFlat, StructureServiceError> {
        let resolved_id = StructureRules::validate_node_id(node_id)?;

        self.repo
            .get_node(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get node '{}'", resolved_id)))
    }

    // ------------------------------------------------------------------
    // move_node
    // ------------------------------------------------------------------
    pub async fn move_node(
        &self,
        node_id: &str,
        new_parent_id: Option<&str>,
        position: i64,
    ) -> Result<(), StructureServiceError> {
        let resolved_node_id = StructureRules::validate_node_id(node_id)?;
        let resolved_parent_id = new_parent_id
            .map(StructureRules::validate_node_id)
            .transpose()?;
        let resolved_position = StructureRules::validate_position(position)?;

        if let Some(ref parent_id) = resolved_parent_id {
            let parent = self
                .repo
                .get_node(parent_id)
                .await
                .map_err(|e| map_repo_error(e, &format!("get parent node '{}'", parent_id)))?;

            if !parent.is_directory {
                return Err(StructureServiceError::Validation(
                    "Only directory nodes can have children.".into(),
                ));
            }

            let node_course_id = self
                .repo
                .get_node_course_id(&resolved_node_id)
                .await
                .map_err(|e| {
                    map_repo_error(e, &format!("get course_id for node '{}'", resolved_node_id))
                })?;

            let parent_course_id = self.repo.get_node_course_id(parent_id).await.map_err(|e| {
                map_repo_error(e, &format!("get course_id for parent '{}'", parent_id))
            })?;

            if node_course_id != parent_course_id {
                return Err(StructureServiceError::Validation(
                    "Parent belongs to a different course.".into(),
                ));
            }

            if self
                .repo
                .would_create_cycle(&resolved_node_id, parent_id)
                .await
                .map_err(|e| {
                    map_repo_error(e, &format!("check cycle for node '{}'", resolved_node_id))
                })?
            {
                return Err(StructureServiceError::Validation(
                    "Moving node would create a cycle in the hierarchy.".into(),
                ));
            }
        }

        self.repo
            .move_node(
                &resolved_node_id,
                resolved_parent_id.as_deref(),
                resolved_position,
            )
            .await
            .map_err(|e| map_repo_error(e, &format!("move node '{}'", resolved_node_id)))
    }

    // ------------------------------------------------------------------
    // create_directory
    // ------------------------------------------------------------------
    pub async fn create_directory(
        &self,
        course_id: &str,
        name: &str,
        parent_id: Option<&str>,
    ) -> Result<StructureNodeFlat, StructureServiceError> {
        let resolved_course = StructureRules::validate_course_id(course_id)?;
        let resolved_name = StructureRules::validate_directory_name(name)?;
        let resolved_parent = parent_id
            .map(StructureRules::validate_node_id)
            .transpose()?;

        if let Some(ref pid) = resolved_parent {
            let parent = self
                .repo
                .get_node(pid)
                .await
                .map_err(|e| map_repo_error(e, &format!("get parent node '{}'", pid)))?;

            if !parent.is_directory {
                return Err(StructureServiceError::Validation(
                    "Only directory nodes can have children.".into(),
                ));
            }

            let parent_course_id =
                self.repo.get_node_course_id(pid).await.map_err(|e| {
                    map_repo_error(e, &format!("get course_id for parent '{}'", pid))
                })?;

            if resolved_course != parent_course_id {
                return Err(StructureServiceError::Validation(
                    "Parent belongs to a different course.".into(),
                ));
            }
        }

        let dir_id = uuid::Uuid::new_v4().to_string();
        let node_id = uuid::Uuid::new_v4().to_string();

        self.dir_repo
            .create(&dir_id, &resolved_course, &resolved_name)
            .await
            .map_err(|e| map_repo_error(e, "create directory"))?;

        let position = 0;

        self.repo
            .create_node(
                &node_id,
                &resolved_course,
                resolved_parent.as_deref(),
                position,
                None,
                Some(&dir_id),
            )
            .await
            .map_err(|e| map_repo_error(e, "create directory node"))
    }

    // ------------------------------------------------------------------
    // delete_node
    // ------------------------------------------------------------------
    pub async fn delete_node(&self, node_id: &str) -> Result<(), StructureServiceError> {
        let resolved_id = StructureRules::validate_node_id(node_id)?;

        let subtree_ids =
            self.repo.get_subtree_ids(&resolved_id).await.map_err(|e| {
                map_repo_error(e, &format!("get subtree for node '{}'", resolved_id))
            })?;

        if subtree_ids.is_empty() {
            return Err(StructureServiceError::NotFound(format!(
                "Node '{}' not found",
                resolved_id
            )));
        }

        let resource_ids = self
            .repo
            .get_resource_ids(&subtree_ids)
            .await
            .map_err(|e| {
                map_repo_error(
                    e,
                    &format!("get resource ids for subtree of '{}'", resolved_id),
                )
            })?;

        let directory_ids = self
            .repo
            .get_directory_ids(&subtree_ids)
            .await
            .map_err(|e| {
                map_repo_error(
                    e,
                    &format!("get directory ids for subtree of '{}'", resolved_id),
                )
            })?;

        for rid in &resource_ids {
            self.resource_repo
                .delete(rid)
                .await
                .map_err(|e| map_repo_error(e, &format!("delete resource '{}'", rid)))?;
        }

        for did in &directory_ids {
            self.dir_repo
                .delete(did)
                .await
                .map_err(|e| map_repo_error(e, &format!("delete directory '{}'", did)))?;
        }

        let _ = self.repo.delete_node(&resolved_id).await;

        Ok(())
    }

    // ------------------------------------------------------------------
    // rename_directory
    // ------------------------------------------------------------------
    pub async fn rename_directory(
        &self,
        node_id: &str,
        new_name: &str,
    ) -> Result<(), StructureServiceError> {
        let resolved_node_id = StructureRules::validate_node_id(node_id)?;
        let resolved_name = StructureRules::validate_directory_name(new_name)?;

        // Найти узел и убедиться что это директория
        let node = self
            .repo
            .get_node(&resolved_node_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get node '{}'", resolved_node_id)))?;

        if !node.is_directory {
            return Err(StructureServiceError::Validation(
                "Node is not a directory.".into(),
            ));
        }

        let dir_id = self.get_directory_id_for_node(&resolved_node_id).await?;

        self.dir_repo
            .update_name(&dir_id, &resolved_name)
            .await
            .map_err(|e| map_repo_error(e, &format!("rename directory '{}'", dir_id)))
    }

    /// Получить directory_id для узла структуры (если это директория).
    async fn get_directory_id_for_node(
        &self,
        node_id: &str,
    ) -> Result<String, StructureServiceError> {
        self.repo
            .get_node_directory_id(node_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get directory id for node '{}'", node_id)))?
            .ok_or_else(|| StructureServiceError::Validation("Node is not a directory.".into()))
    }

    // ------------------------------------------------------------------
    // get_directories
    // ------------------------------------------------------------------
    pub async fn get_directories(
        &self,
        course_id: &str,
    ) -> Result<Vec<DirectoryData>, StructureServiceError> {
        let resolved_course = StructureRules::validate_course_id(course_id)?;

        self.dir_repo
            .get_by_course(&resolved_course)
            .await
            .map_err(|e| {
                map_repo_error(
                    e,
                    &format!("get directories for course '{}'", resolved_course),
                )
            })
    }

    // ------------------------------------------------------------------
    // get_directory
    // ------------------------------------------------------------------
    pub async fn get_directory(
        &self,
        directory_id: &str,
    ) -> Result<DirectoryData, StructureServiceError> {
        let resolved_id = StructureRules::validate_directory_id(directory_id)?;

        self.dir_repo
            .get(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get directory '{}'", resolved_id)))
    }
}

fn map_repo_error(e: RepoError, context: &str) -> StructureServiceError {
    match e {
        RepoError::NotFound(msg) => StructureServiceError::NotFound(msg),
        RepoError::Conflict(msg) => StructureServiceError::Forbidden(msg),
        RepoError::Db(sqlx_err) => {
            StructureServiceError::Internal(format!("DB error while {}: {}", context, sqlx_err))
        }
    }
}
