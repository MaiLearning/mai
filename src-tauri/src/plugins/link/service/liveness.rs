use std::collections::HashSet;
use std::sync::Arc;

use async_trait::async_trait;

use crate::database::repository::course::CourseRepository;
use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::RepoError;

/// Проверка живости узлов одного вида: нужна для sweep (мёртвые источники)
/// и вычисления targetStatus (живость цели).
#[async_trait]
pub trait NodeLiveness: Send + Sync {
    /// Вид узла ("resource" | "course") — ключ реестра живости.
    fn kind(&self) -> &'static str;

    /// Возвращает подмножество переданных id, которые существуют в хранилище.
    /// NotFound у отдельного id — узел мёртв; прочие ошибки отдаются наружу.
    async fn existing_ids(&self, ids: &[String]) -> Result<HashSet<String>, RepoError>;
}

/// Живость ресурсов: обёртка над ResourceRepository.
pub struct ResourceLiveness {
    resource_repo: Arc<dyn ResourceRepository>,
}

impl ResourceLiveness {
    pub const KIND: &'static str = "resource";

    pub fn new(resource_repo: Arc<dyn ResourceRepository>) -> Self {
        Self { resource_repo }
    }
}

#[async_trait]
impl NodeLiveness for ResourceLiveness {
    fn kind(&self) -> &'static str {
        Self::KIND
    }

    async fn existing_ids(&self, ids: &[String]) -> Result<HashSet<String>, RepoError> {
        let mut existing = HashSet::new();
        for id in ids {
            match self.resource_repo.get(id).await {
                Ok(_) => {
                    existing.insert(id.clone());
                }
                // Мёртвый узел — не ошибка; прочие сбои хранилища отдаём наружу.
                Err(RepoError::NotFound(_)) => {}
                Err(e) => return Err(e),
            }
        }
        Ok(existing)
    }
}

/// Живость курсов: обёртка над CourseRepository.
pub struct CourseLiveness {
    course_repo: Arc<dyn CourseRepository>,
}

impl CourseLiveness {
    pub const KIND: &'static str = "course";

    pub fn new(course_repo: Arc<dyn CourseRepository>) -> Self {
        Self { course_repo }
    }
}

#[async_trait]
impl NodeLiveness for CourseLiveness {
    fn kind(&self) -> &'static str {
        Self::KIND
    }

    async fn existing_ids(&self, ids: &[String]) -> Result<HashSet<String>, RepoError> {
        let mut existing = HashSet::new();
        for id in ids {
            match self.course_repo.get_course(id).await {
                Ok(_) => {
                    existing.insert(id.clone());
                }
                Err(RepoError::NotFound(_)) => {}
                Err(e) => return Err(e),
            }
        }
        Ok(existing)
    }
}
