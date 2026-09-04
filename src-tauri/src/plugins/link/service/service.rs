use std::collections::HashMap;
use std::sync::Arc;

use crate::database::repository::course::CourseRepository;
use crate::database::repository::link::LinkRepository;
use crate::database::repository::plugin::PluginRepository;
use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::RepoError;
use crate::plugins::link::service::data::LinkData;
use crate::plugins::link::service::exceptions::LinkServiceError;
use crate::plugins::link::service::liveness::{CourseLiveness, NodeLiveness, ResourceLiveness};
use crate::plugins::link::service::rules;
use crate::services::events::SharedChangePublisher;

pub(super) fn map_repo_error(e: RepoError, context: &str) -> LinkServiceError {
    match e {
        RepoError::NotFound(msg) => LinkServiceError::NotFound(msg),
        RepoError::Conflict(msg) => {
            LinkServiceError::Internal(format!("Conflict while {}: {}", context, msg))
        }
        RepoError::Db(msg) => {
            LinkServiceError::Internal(format!("DB error while {}: {}", context, msg))
        }
    }
}

pub(super) fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

/// Сервис link-плагина: рёбра графа связей между ресурсами, курсами и внешними URI.
/// Существование источника при создании не проверяется — мёртвые источники
/// вычищает sweep; живость цели вычисляется при каждом чтении.
pub struct LinkService {
    pub(super) link_repo: Arc<dyn LinkRepository>,
    pub(super) resource_repo: Arc<dyn ResourceRepository>,
    pub(super) plugin_repo: Arc<dyn PluginRepository>,
    pub(super) publisher: SharedChangePublisher,
    /// Реестр живости узлов: kind → проверка существования.
    pub(super) liveness: HashMap<&'static str, Arc<dyn NodeLiveness>>,
}

impl LinkService {
    pub fn new(
        link_repo: Arc<dyn LinkRepository>,
        resource_repo: Arc<dyn ResourceRepository>,
        course_repo: Arc<dyn CourseRepository>,
        plugin_repo: Arc<dyn PluginRepository>,
        publisher: SharedChangePublisher,
    ) -> Self {
        let mut liveness: HashMap<&'static str, Arc<dyn NodeLiveness>> = HashMap::new();
        liveness.insert(
            ResourceLiveness::KIND,
            Arc::new(ResourceLiveness::new(resource_repo.clone())),
        );
        liveness.insert(
            CourseLiveness::KIND,
            Arc::new(CourseLiveness::new(course_repo)),
        );

        Self {
            link_repo,
            resource_repo,
            plugin_repo,
            publisher,
            liveness,
        }
    }

    /// Рёбра указанного источника.
    pub async fn list_links(
        &self,
        source_type: &str,
        source_id: &str,
    ) -> Result<Vec<LinkData>, LinkServiceError> {
        let source_type = rules::validate_source_type(source_type)?;
        let source_id = rules::validate_source_id(source_id)?;

        let mut links = self
            .link_repo
            .list_by_source(&source_type, &source_id)
            .await?;
        self.resolve_target_status(&mut links).await?;
        Ok(links)
    }

    /// Обратные рёбра: все связи, ведущие в указанную цель.
    pub async fn list_backlinks(
        &self,
        target: super::data::LinkTargetData,
    ) -> Result<Vec<LinkData>, LinkServiceError> {
        let target = rules::validate_target(&target)?;

        let mut links = self.link_repo.list_by_target(&target).await?;
        self.resolve_target_status(&mut links).await?;
        Ok(links)
    }

    /// Рёбра курса: источник — сам курс или ресурсы курса. Перед выборкой — sweep.
    pub async fn list_course_links(
        &self,
        course_id: &str,
    ) -> Result<Vec<LinkData>, LinkServiceError> {
        let course_id = rules::validate_source_id(course_id)?;

        self.sweep().await?;
        let mut links = self.link_repo.list_by_course(&course_id).await?;
        self.resolve_target_status(&mut links).await?;
        Ok(links)
    }
}
