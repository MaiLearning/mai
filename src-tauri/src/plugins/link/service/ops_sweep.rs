use std::collections::HashSet;

use super::data::{LinkData, LinkSourceRef, LinkStatus, LinkTargetData};
use super::exceptions::LinkServiceError;
use super::rules;
use super::service::LinkService;

impl LinkService {
    /// GC: удаляет рёбра с мёртвыми источниками (удалённые курсы/ресурсы).
    /// События не публикуются — источники уже удалены их клиентами.
    pub(super) async fn sweep(&self) -> Result<(), LinkServiceError> {
        let refs = self.link_repo.list_source_refs().await?;
        let dead = self.find_dead_sources(refs).await?;
        if dead.is_empty() {
            return Ok(());
        }

        // Собираем id рёбер мёртвых источников и удаляем одной пачкой.
        let mut dead_link_ids: Vec<String> = Vec::new();
        for r in &dead {
            let links = self
                .link_repo
                .list_by_source(&r.source_type, &r.source_id)
                .await?;
            dead_link_ids.extend(links.into_iter().map(|l| l.id));
        }
        let removed = self.link_repo.delete_by_ids(&dead_link_ids).await?;
        log::info!("Sweep связей: удалено {} мёртвых рёбер", removed);
        Ok(())
    }

    /// Источники каждого вида, которых нет в хранилище.
    async fn find_dead_sources(
        &self,
        refs: Vec<LinkSourceRef>,
    ) -> Result<Vec<LinkSourceRef>, LinkServiceError> {
        let mut dead = Vec::new();
        for kind in rules::SOURCE_KINDS {
            let ids: Vec<String> = refs
                .iter()
                .filter(|r| r.source_type == kind)
                .map(|r| r.source_id.clone())
                .collect();
            if ids.is_empty() {
                continue;
            }

            let alive = match self.liveness.get(kind) {
                Some(node) => node.existing_ids(&ids).await?,
                None => HashSet::new(),
            };
            for r in refs.iter().filter(|r| r.source_type == kind) {
                if !alive.contains(&r.source_id) {
                    dead.push(r.clone());
                }
            }
        }
        Ok(dead)
    }

    /// Вычисляет targetStatus для пачки рёбер: uri всегда жива,
    /// resource/course проверяются батчем через реестр живости.
    pub(super) async fn resolve_target_status(
        &self,
        links: &mut [LinkData],
    ) -> Result<(), LinkServiceError> {
        let mut resource_ids: Vec<String> = Vec::new();
        let mut course_ids: Vec<String> = Vec::new();
        for link in links.iter() {
            match &link.target {
                LinkTargetData::Resource { resource_id, .. } => {
                    resource_ids.push(resource_id.clone())
                }
                LinkTargetData::Course { course_id } => course_ids.push(course_id.clone()),
                LinkTargetData::Uri { .. } => {}
            }
        }

        let alive_resources = self.existing_ids("resource", resource_ids).await?;
        let alive_courses = self.existing_ids("course", course_ids).await?;

        for link in links.iter_mut() {
            link.target_status = match &link.target {
                LinkTargetData::Uri { .. } => LinkStatus::Ok,
                LinkTargetData::Resource { resource_id, .. } => {
                    if alive_resources.contains(resource_id) {
                        LinkStatus::Ok
                    } else {
                        LinkStatus::Broken
                    }
                }
                LinkTargetData::Course { course_id } => {
                    if alive_courses.contains(course_id) {
                        LinkStatus::Ok
                    } else {
                        LinkStatus::Broken
                    }
                }
            };
        }
        Ok(())
    }

    /// Запрос живости через реестр; пустой набор — без похода в хранилище.
    async fn existing_ids(
        &self,
        kind: &str,
        ids: Vec<String>,
    ) -> Result<HashSet<String>, LinkServiceError> {
        if ids.is_empty() {
            return Ok(HashSet::new());
        }
        let node = self.liveness.get(kind).ok_or_else(|| {
            LinkServiceError::Internal(format!("No liveness checker for kind '{}'", kind))
        })?;
        Ok(node.existing_ids(&ids).await?)
    }
}
