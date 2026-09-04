use std::slice;

use super::data::{CreateLinkData, LinkData, LinkStatus, UpdateLinkData};
use super::exceptions::LinkServiceError;
use super::rules;
use super::service::{map_repo_error, now_millis, LinkService};
use crate::database::repository::RepoError;
use crate::services::events::{ChangeAction, EntityChanged, EntityKind};

impl LinkService {
    /// Создание ребра: normalize → validate → проверка владельца → insert → событие.
    pub async fn create(&self, input: CreateLinkData) -> Result<LinkData, LinkServiceError> {
        let source_type = rules::validate_source_type(&input.source_type)?;
        let source_id = rules::validate_source_id(&input.source_id)?;
        let target = rules::validate_target(&input.target)?;
        let owner_plugin_id = rules::validate_owner_plugin_id(&input.owner_plugin_id)?;
        let title = rules::validate_title(input.title)?;
        let description = rules::validate_description(input.description)?;

        // Владелец ребра должен быть зарегистрированным плагином.
        self.plugin_repo
            .get(&owner_plugin_id)
            .await
            .map_err(|e| match e {
                RepoError::NotFound(_) => LinkServiceError::Validation(format!(
                    "Owner plugin '{}' is not registered",
                    owner_plugin_id
                )),
                other => map_repo_error(other, "check owner plugin"),
            })?;

        let now = now_millis();
        let mut link = LinkData {
            id: uuid::Uuid::new_v4().to_string(),
            source_type,
            source_id,
            target,
            owner_plugin_id,
            title,
            description,
            created_at: now,
            updated_at: now,
            target_status: LinkStatus::Ok, // заглушка; вычисляется ниже
        };

        self.link_repo.insert(link.clone()).await?;
        self.resolve_target_status(slice::from_mut(&mut link))
            .await?;

        let course_id = self
            .resolve_course_id(&link.source_type, &link.source_id)
            .await;
        self.publish(ChangeAction::Created, &link.id, course_id);
        log::info!("Связь создана: {}", link.id);
        Ok(link)
    }

    /// Обновление ребра: только владелец; source не меняется.
    pub async fn update(&self, input: UpdateLinkData) -> Result<LinkData, LinkServiceError> {
        let stored = self.link_repo.get(&input.id).await?;
        self.check_owner(&stored, &input.owner_plugin_id)?;

        let target = rules::validate_target(&input.target)?;
        let title = rules::validate_title(input.title)?;
        let description = rules::validate_description(input.description)?;

        let mut updated = LinkData {
            id: stored.id.clone(),
            source_type: stored.source_type,
            source_id: stored.source_id,
            target,
            owner_plugin_id: stored.owner_plugin_id,
            title,
            description,
            created_at: stored.created_at,
            updated_at: now_millis(),
            target_status: LinkStatus::Ok, // заглушка; вычисляется ниже
        };

        self.link_repo.update(updated.clone()).await?;
        self.resolve_target_status(slice::from_mut(&mut updated))
            .await?;

        let course_id = self
            .resolve_course_id(&updated.source_type, &updated.source_id)
            .await;
        self.publish(ChangeAction::Updated, &updated.id, course_id);
        log::info!("Связь обновлена: {}", updated.id);
        Ok(updated)
    }

    /// Удаление ребра: только владелец.
    pub async fn delete(&self, id: &str, owner_plugin_id: &str) -> Result<(), LinkServiceError> {
        let stored = self.link_repo.get(id).await?;
        self.check_owner(&stored, owner_plugin_id)?;

        self.link_repo.delete(id).await?;
        let course_id = self
            .resolve_course_id(&stored.source_type, &stored.source_id)
            .await;
        self.publish(ChangeAction::Deleted, id, course_id);
        log::info!("Связь удалена: {}", id);
        Ok(())
    }

    /// Ребро может менять только плагин-владелец.
    fn check_owner(
        &self,
        stored: &LinkData,
        owner_plugin_id: &str,
    ) -> Result<(), LinkServiceError> {
        if stored.owner_plugin_id != owner_plugin_id {
            return Err(LinkServiceError::Forbidden(format!(
                "Link '{}' is owned by '{}', caller is '{}'",
                stored.id, stored.owner_plugin_id, owner_plugin_id
            )));
        }
        Ok(())
    }

    /// Курс источника для события изменения: course → сам sourceId,
    /// resource → course_id ресурса (мёртвый ресурс — без курса).
    pub(super) async fn resolve_course_id(
        &self,
        source_type: &str,
        source_id: &str,
    ) -> Option<String> {
        match source_type {
            "course" => Some(source_id.to_string()),
            "resource" => self
                .resource_repo
                .get(source_id)
                .await
                .ok()
                .map(|r| r.course_id),
            _ => None,
        }
    }

    /// Публикация события изменения (fire-and-forget).
    pub(super) fn publish(&self, action: ChangeAction, id: &str, course_id: Option<String>) {
        self.publisher.publish(EntityChanged {
            entity: EntityKind::Link,
            action,
            id: id.to_string(),
            course_id,
        });
    }
}
