use sqlx::SqlitePool;
use tauri::State;

use crate::plugins::link::runtime::build_service;
use crate::plugins::link::service::data::{
    CreateLinkData, LinkData, LinkTargetData, UpdateLinkData,
};
use crate::utils::events::ChangePublishers;

/// Рёбра указанного источника.
#[tauri::command]
pub async fn list_links(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    source_type: String,
    source_id: String,
) -> Result<Vec<LinkData>, String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .list_links(&source_type, &source_id)
        .await
        .map_err(|e| e.to_string())
}

/// Обратные рёбра: связи, ведущие в указанную цель.
#[tauri::command]
pub async fn list_backlinks(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    target: LinkTargetData,
) -> Result<Vec<LinkData>, String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .list_backlinks(target)
        .await
        .map_err(|e| e.to_string())
}

/// Рёбра курса (от курса и его ресурсов); перед выборкой — sweep мёртвых источников.
#[tauri::command]
pub async fn list_course_links(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    course_id: String,
) -> Result<Vec<LinkData>, String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .list_course_links(&course_id)
        .await
        .map_err(|e| e.to_string())
}

/// Создание ребра.
#[tauri::command]
pub async fn create_link(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    input: CreateLinkData,
) -> Result<LinkData, String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .create(input)
        .await
        .map_err(|e| e.to_string())
}

/// Обновление ребра (только владелец).
#[tauri::command]
pub async fn update_link(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    input: UpdateLinkData,
) -> Result<LinkData, String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .update(input)
        .await
        .map_err(|e| e.to_string())
}

/// Удаление ребра (только владелец).
#[tauri::command]
pub async fn delete_link(
    pool: State<'_, SqlitePool>,
    publishers: State<'_, ChangePublishers>,
    id: String,
    owner_plugin_id: String,
) -> Result<(), String> {
    build_service(pool.inner(), publishers.ipc.clone())
        .delete(&id, &owner_plugin_id)
        .await
        .map_err(|e| e.to_string())
}
