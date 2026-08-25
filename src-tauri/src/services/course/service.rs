// Use-Case'ы для Course (аналог Course из platform/lib/entities/course/course.dart).
// Каждый метод: нормализация → валидация → вызов репозитория → маппинг ошибок.

use std::sync::Arc;

use crate::database::repository::course::CourseRepository;
use crate::database::repository::RepoError;
use crate::services::course::{CourseData, CourseTagStat};
use crate::utils::paths::{AppPaths, FsError};

use super::exceptions::CourseServiceError;
use super::rules::{CourseRules, DEFAULT_COURSE_STATUS};

fn map_fs_error(e: FsError, context: &str) -> CourseServiceError {
    match e {
        FsError::NotFound(msg) => CourseServiceError::NotFound(msg),
        FsError::AlreadyExists(msg) => CourseServiceError::Forbidden(msg),
        FsError::Io(e) => {
            CourseServiceError::Internal(format!("FS error while {}: {}", context, e))
        }
    }
}

pub struct CourseService {
    app_paths: AppPaths,
    repo: Arc<dyn CourseRepository>,
}

impl CourseService {
    pub fn new(app_paths: AppPaths, repo: Arc<dyn CourseRepository>) -> Self {
        Self { app_paths, repo }
    }

    // ------------------------------------------------------------------
    // all
    // ------------------------------------------------------------------
    pub async fn all(&self) -> Result<Vec<CourseData>, CourseServiceError> {
        self.repo
            .all_courses()
            .await
            .map_err(|e| map_repo_error(e, "get courses"))
    }

    // ------------------------------------------------------------------
    // all_tags
    // ------------------------------------------------------------------
    pub async fn all_tags(&self) -> Result<Vec<CourseTagStat>, CourseServiceError> {
        self.repo
            .all_tags()
            .await
            .map_err(|e| map_repo_error(e, "get tags"))
    }

    // ------------------------------------------------------------------
    // get
    // ------------------------------------------------------------------
    pub async fn get(&self, id: &str) -> Result<CourseData, CourseServiceError> {
        let resolved_id = CourseRules::validate_course_id(id)?;

        self.repo
            .get_course(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("get course '{}'", resolved_id)))
    }

    // ------------------------------------------------------------------
    // create
    // ------------------------------------------------------------------
    pub async fn create(&self, data: CourseData) -> Result<CourseData, CourseServiceError> {
        // normalize & validate
        let resolved_id = CourseRules::validate_course_id(&data.id)?;
        let resolved_name = CourseRules::validate_course_name(&data.name)?;
        let resolved_description =
            CourseRules::validate_course_description(data.description.as_deref())?;
        let resolved_tags = CourseRules::validate_course_tags(&data.tags)?;
        let resolved_color_from = CourseRules::validate_course_color(data.color_from.as_deref())?;
        let resolved_color_to = CourseRules::validate_course_color(data.color_to.as_deref())?;
        let resolved_status = match data.status.trim() {
            "" => CourseRules::validate_course_status(DEFAULT_COURSE_STATUS)?,
            s => CourseRules::validate_course_status(s)?,
        };
        CourseRules::validate_course_timeline(data.created_at, data.updated_at)?;

        let normalized = CourseData {
            id: resolved_id.clone(),
            name: resolved_name,
            description: resolved_description,
            tags: resolved_tags,
            color_from: resolved_color_from,
            color_to: resolved_color_to,
            status: resolved_status,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        let result = self
            .repo
            .create_course(normalized)
            .await
            .map_err(|e| map_repo_error(e, "create course"))?;

        // ФС: создаём директорию курса + resources/
        self.app_paths
            .create_course_dir(&resolved_id)
            .map_err(|e| map_fs_error(e, "create course dir"))?;
        self.app_paths
            .create_course_resources_dir(&resolved_id)
            .map_err(|e| map_fs_error(e, "create course resources dir"))?;

        Ok(result)
    }

    // ------------------------------------------------------------------
    // update
    // ------------------------------------------------------------------
    pub async fn update(&self, data: CourseData) -> Result<CourseData, CourseServiceError> {
        let resolved_id = CourseRules::validate_course_id(&data.id)?;
        let resolved_name = CourseRules::validate_course_name(&data.name)?;
        let resolved_description =
            CourseRules::validate_course_description(data.description.as_deref())?;
        let resolved_tags = CourseRules::validate_course_tags(&data.tags)?;
        let resolved_color_from = CourseRules::validate_course_color(data.color_from.as_deref())?;
        let resolved_color_to = CourseRules::validate_course_color(data.color_to.as_deref())?;
        let resolved_status = match data.status.trim() {
            "" => CourseRules::validate_course_status(DEFAULT_COURSE_STATUS)?,
            s => CourseRules::validate_course_status(s)?,
        };
        CourseRules::validate_course_timeline(data.created_at, data.updated_at)?;

        let normalized = CourseData {
            id: resolved_id,
            name: resolved_name,
            description: resolved_description,
            tags: resolved_tags,
            color_from: resolved_color_from,
            color_to: resolved_color_to,
            status: resolved_status,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        self.repo
            .update_course(normalized)
            .await
            .map_err(|e| map_repo_error(e, "update course"))
    }

    // ------------------------------------------------------------------
    // delete
    // ------------------------------------------------------------------
    pub async fn delete(&self, id: &str) -> Result<CourseData, CourseServiceError> {
        let resolved_id = CourseRules::validate_course_id(id)?;

        let result = self
            .repo
            .delete_course(&resolved_id)
            .await
            .map_err(|e| map_repo_error(e, &format!("delete course '{}'", resolved_id)))?;

        // ФС: удаляем директорию курса
        self.app_paths
            .remove_course_dir(&resolved_id)
            .map_err(|e| map_fs_error(e, "remove course dir"))?;

        Ok(result)
    }
}

// ---------------------------------------------------------------------------
// Маппинг ошибок репозитория в CourseServiceError
// ---------------------------------------------------------------------------

fn map_repo_error(e: RepoError, context: &str) -> CourseServiceError {
    match e {
        RepoError::NotFound(msg) => CourseServiceError::NotFound(msg),
        RepoError::Conflict(msg) => CourseServiceError::Forbidden(msg),
        RepoError::Db(sqlx_err) => {
            CourseServiceError::Internal(format!("DB error while {}: {}", context, sqlx_err))
        }
    }
}
