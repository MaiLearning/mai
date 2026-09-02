use std::sync::Arc;

use crate::database::repository::plugin::PluginRepository;
use crate::database::repository::RepoError;
use crate::services::events::{ChangeAction, EntityChanged, EntityKind, SharedChangePublisher};
use crate::utils::paths::{AppPaths, FsError};

use super::data::{PluginData, PluginKind, PluginManifest};
use super::exceptions::PluginServiceError;
use super::rules;

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

fn map_repo_error(e: RepoError, context: &str) -> PluginServiceError {
    match e {
        RepoError::NotFound(msg) => PluginServiceError::NotFound(msg),
        RepoError::Conflict(msg) => PluginServiceError::AlreadyExists(msg),
        RepoError::Db(msg) => {
            PluginServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

fn map_fs_error(e: FsError, context: &str) -> PluginServiceError {
    match e {
        FsError::NotFound(msg) => PluginServiceError::NotFound(msg),
        FsError::AlreadyExists(msg) => PluginServiceError::AlreadyExists(msg),
        FsError::Io(e) => {
            PluginServiceError::Internal(format!("FS error while {}: {}", context, e))
        }
    }
}

pub struct PluginService {
    app_paths: AppPaths,
    plugin_repo: Arc<dyn PluginRepository>,
    publisher: SharedChangePublisher,
}

impl PluginService {
    pub fn new(
        app_paths: AppPaths,
        plugin_repo: Arc<dyn PluginRepository>,
        publisher: SharedChangePublisher,
    ) -> Self {
        Self {
            app_paths,
            plugin_repo,
            publisher,
        }
    }

    pub fn app_paths(&self) -> &AppPaths {
        &self.app_paths
    }

    pub async fn list(&self) -> Result<Vec<PluginData>, PluginServiceError> {
        self.plugin_repo
            .all()
            .await
            .map_err(|e| map_repo_error(e, "list plugins"))
    }

    pub async fn get(&self, id: &str) -> Result<PluginData, PluginServiceError> {
        let resolved_id = rules::validate_plugin_id(id)?;
        self.plugin_repo
            .get(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get plugin '{}'", resolved_id)))
    }

    pub async fn add_external(
        &self,
        manifest: PluginManifest,
        code: &[u8],
        sdk_version: &str,
    ) -> Result<PluginData, PluginServiceError> {
        let id = rules::validate_plugin_id(&manifest.id)?;
        let name = rules::validate_plugin_name(&manifest.name)?;
        let version = rules::validate_version(&manifest.version)?;
        rules::validate_manifest(&manifest)?;
        rules::validate_sdk_version(sdk_version)?;

        if code.is_empty() {
            return Err(PluginServiceError::Validation(
                "Plugin code must not be empty.".into(),
            ));
        }

        let manifest_json = serde_json::to_string_pretty(&manifest)
            .map_err(|e| PluginServiceError::Internal(format!("Manifest serialization: {}", e)))?;

        let now = now_millis();
        let data = PluginData {
            id: id.clone(),
            name,
            description: manifest.description,
            author: manifest.author,
            version,
            enabled: true,
            kind: PluginKind::External,
            installed_at: now,
            updated_at: now,
        };

        let data = self
            .plugin_repo
            .create_external(data, sdk_version)
            .await
            .map_err(|e| map_repo_error(e, "add external plugin"))?;

        self.app_paths
            .create_plugin_dir(&id)
            .map_err(|e| map_fs_error(e, "create plugin dir"))?;

        let code_str = std::str::from_utf8(code)
            .map_err(|e| PluginServiceError::Internal(format!("Invalid UTF-8 in code: {}", e)))?;
        self.app_paths
            .write_plugin_code(&id, code_str)
            .map_err(|e| map_fs_error(e, "write plugin code"))?;

        self.app_paths
            .write_plugin_manifest(&id, &manifest_json)
            .map_err(|e| map_fs_error(e, "write plugin manifest"))?;

        self.publisher.publish(EntityChanged {
            entity: EntityKind::Plugin,
            action: ChangeAction::Created,
            id,
            course_id: None,
        });

        Ok(data)
    }

    pub async fn add_internal(
        &self,
        id: &str,
        name: &str,
        version: &str,
        description: Option<&str>,
        author: Option<&str>,
    ) -> Result<PluginData, PluginServiceError> {
        let resolved_id = rules::validate_plugin_id(id)?;
        let resolved_name = rules::validate_plugin_name(name)?;
        let resolved_version = rules::validate_version(version)?;

        let now = now_millis();
        let data = PluginData {
            id: resolved_id,
            name: resolved_name,
            description: description.map(|s| s.to_string()),
            author: author.map(|s| s.to_string()),
            version: resolved_version,
            enabled: true,
            kind: PluginKind::Internal,
            installed_at: now,
            updated_at: now,
        };

        let data = self
            .plugin_repo
            .create_internal(data)
            .await
            .map_err(|e| map_repo_error(e, "add internal plugin"))?;

        Ok(data)
    }

    pub async fn remove(&self, id: &str) -> Result<PluginData, PluginServiceError> {
        let resolved_id = rules::validate_plugin_id(id)?;

        let data = self
            .plugin_repo
            .delete(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("remove plugin '{}'", resolved_id)))?;

        self.app_paths
            .remove_plugin_dir(&resolved_id)
            .map_err(|e| map_fs_error(e, "remove plugin dir"))?;

        self.publisher.publish(EntityChanged {
            entity: EntityKind::Plugin,
            action: ChangeAction::Deleted,
            id: resolved_id,
            course_id: None,
        });

        Ok(data)
    }
    // Здесь был метод update но ИИ его удалил. В целом - в обновлении нуждается только external
    // плагины, так что его в целом надо было переписать. Но не сейчас

    pub async fn set_enabled(&self, id: &str, enabled: bool) -> Result<(), PluginServiceError> {
        let resolved_id = rules::validate_plugin_id(id)?;
        self.plugin_repo
            .set_enabled(&resolved_id, enabled)
            .await
            .map_err(|e| map_repo_error(e, &format!("set_enabled '{}'", resolved_id)))?;

        self.publisher.publish(EntityChanged {
            entity: EntityKind::Plugin,
            action: ChangeAction::Updated,
            id: resolved_id,
            course_id: None,
        });

        Ok(())
    }

    // -- Файловые операции -------------------------------------------------

    /// Прочитать JS-код плагина из ФС.
    pub fn get_code(&self, plugin_id: &str) -> Result<String, PluginServiceError> {
        self.app_paths
            .read_plugin_code(plugin_id)
            .map_err(|e| map_fs_error(e, "read plugin code"))
    }

    /// Прочитать манифест плагина из ФС.
    pub fn get_manifest(&self, plugin_id: &str) -> Result<String, PluginServiceError> {
        self.app_paths
            .read_plugin_manifest(plugin_id)
            .map_err(|e| map_fs_error(e, "read plugin manifest"))
    }
}
