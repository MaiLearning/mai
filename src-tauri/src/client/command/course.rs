use std::sync::Arc;

use serde::Deserialize;
use sqlx::SqlitePool;
use tauri::State;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::services::course::{CourseData, CourseService, CourseTagStat};
use crate::utils::paths::AppPaths;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCourseRequest {
    pub name: String,
    pub description: Option<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    pub color_from: Option<String>,
    pub color_to: Option<String>,
    pub status: Option<String>,
}

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

#[tauri::command]
pub async fn all_courses(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
) -> Result<Vec<CourseData>, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);
    service.all().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn all_tags(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
) -> Result<Vec<CourseTagStat>, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);
    service.all_tags().await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_course(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    request: CreateCourseRequest,
) -> Result<CourseData, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);

    let now = now_millis();
    let data = CourseData {
        id: uuid::Uuid::new_v4().to_string(),
        name: request.name,
        description: request.description,
        tags: request.tags,
        color_from: request.color_from,
        color_to: request.color_to,
        status: request.status.unwrap_or_default(),
        created_at: now,
        updated_at: now,
    };

    service.create(data).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_course(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    id: String,
) -> Result<CourseData, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);
    service.get(&id).await.map_err(|e| e.to_string())
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCourseRequest {
    pub name: String,
    pub description: Option<String>,
    #[serde(default)]
    pub tags: Vec<String>,
    pub color_from: Option<String>,
    pub color_to: Option<String>,
    pub status: Option<String>,
}

#[tauri::command]
pub async fn update_course(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    id: String,
    request: UpdateCourseRequest,
) -> Result<CourseData, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);

    let existing = service.get(&id).await.map_err(|e| e.to_string())?;
    let data = CourseData {
        id,
        name: request.name,
        description: request.description,
        tags: request.tags,
        color_from: request.color_from,
        color_to: request.color_to,
        status: request.status.unwrap_or_default(),
        created_at: existing.created_at,
        updated_at: now_millis(),
    };

    service.update(data).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_course(
    pool: State<'_, SqlitePool>,
    app_paths: State<'_, AppPaths>,
    id: String,
) -> Result<CourseData, String> {
    let repo = Arc::new(SqliteCourseRepository::new(pool.inner().clone()));
    let service = CourseService::new(app_paths.inner().clone(), repo);
    service.delete(&id).await.map_err(|e| e.to_string())
}
