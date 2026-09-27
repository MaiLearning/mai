//! Тесты TheoryService на реальном SQLite: сервис + миграции + FK.
//! У каждого теста — своя временная БД.

use std::sync::Arc;

use crate::database::repository::resource::ResourceRepository;
use crate::database::repository::theory::TheoryRepository;
use crate::database::sqlite::migration::MigrationRunner;
use crate::database::sqlite::pool::create_pool;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::theory::SqliteTheoryRepository;
use crate::database::sqlite::settings::DatabaseConfig;

use super::exceptions::TheoryServiceError;
use super::service::{TheoryService, NEVER_SAVED};

/// Сервис на свежей БД с прогнанными миграциями + пул для проверок напрямую.
async fn service() -> (TheoryService, sqlx::SqlitePool) {
    let config = DatabaseConfig::for_test();
    MigrationRunner::new().run(&config.path);
    let pool = create_pool(&config.path, config.max_connections).await;

    let theory_repo: Arc<dyn TheoryRepository> =
        Arc::new(SqliteTheoryRepository::new(pool.clone()));
    let resource_repo: Arc<dyn ResourceRepository> =
        Arc::new(SqliteResourceRepository::new(pool.clone()));

    (TheoryService::new(theory_repo, resource_repo), pool)
}

/// Курс + ресурс: теорию без существующего ресурса БД не примет (FK).
async fn seed_resource(pool: &sqlx::SqlitePool, course_id: &str, resource_id: &str) {
    sqlx::query("INSERT INTO courses (id, name, created_at, updated_at) VALUES (?, 'c', 0, 0)")
        .bind(course_id)
        .execute(pool)
        .await
        .expect("курс вставлен");

    sqlx::query("INSERT INTO resources (id, course_id, name) VALUES (?, ?, 'theory')")
        .bind(resource_id)
        .bind(course_id)
        .execute(pool)
        .await
        .expect("ресурс вставлен");
}

/// Сколько строк в theory_content — ловим неявные записи при чтении.
async fn theory_rows(pool: &sqlx::SqlitePool) -> i64 {
    sqlx::query_scalar("SELECT COUNT(*) FROM theory_content")
        .fetch_one(pool)
        .await
        .expect("подсчёт строк theory_content")
}

#[tokio::test]
async fn get_missing_is_not_found_without_writing() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;

    match service.get("r-1").await {
        Err(TheoryServiceError::NotFound(msg)) => assert!(msg.contains("r-1"), "{msg}"),
        other => panic!("ожидали NotFound, получили {other:?}"),
    }
    assert_eq!(theory_rows(&pool).await, 0, "строгое чтение не пишет");

    assert!(matches!(
        service.get("no-such-resource").await,
        Err(TheoryServiceError::NotFound(_))
    ));
}

#[tokio::test]
async fn get_or_default_returns_unsaved_root_without_row() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;

    let data = service.get_or_default("r-1").await.expect("пустой корень");

    assert_eq!(data.resource_id, "r-1");
    assert_eq!(data.created_at, NEVER_SAVED);
    assert_eq!(data.updated_at, NEVER_SAVED);
    assert_eq!(data.content["root"]["type"], "root");
    assert_eq!(data.content["root"]["children"][0]["type"], "paragraph");
    assert_eq!(
        theory_rows(&pool).await,
        0,
        "чтение не материализует строку"
    );
}

#[tokio::test]
async fn get_or_default_unknown_resource_is_not_found() {
    let (service, _pool) = service().await;

    match service.get_or_default("no-such-resource").await {
        Err(TheoryServiceError::NotFound(msg)) => {
            assert!(msg.contains("no-such-resource"), "{msg}")
        }
        other => panic!("ожидали NotFound про ресурс, получили {other:?}"),
    }
}

#[tokio::test]
async fn get_or_default_existing_row_returns_stored_without_write() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;
    let saved = service
        .save("r-1", serde_json::json!({ "root": { "type": "root" } }))
        .await
        .expect("контент сохранён");

    let data = service
        .get_or_default("r-1")
        .await
        .expect("контент прочитан");

    assert_eq!(data.created_at, saved.created_at);
    assert_eq!(data.updated_at, saved.updated_at);
    assert_eq!(data.content, saved.content);
    assert_eq!(theory_rows(&pool).await, 1);
}

#[tokio::test]
async fn save_preserves_created_at_and_bumps_updated_at() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;

    let first = service
        .save("r-1", serde_json::json!({ "root": { "type": "root" } }))
        .await
        .expect("первое сохранение");
    assert_eq!(
        first.created_at, first.updated_at,
        "новая строка создана сейчас"
    );

    tokio::time::sleep(std::time::Duration::from_millis(2)).await;
    let second = service
        .save(
            "r-1",
            serde_json::json!({ "root": { "type": "root", "v": 2 } }),
        )
        .await
        .expect("второе сохранение");

    assert_eq!(
        first.created_at, second.created_at,
        "created_at сохраняется"
    );
    assert!(second.updated_at > first.updated_at, "updated_at растёт");
    assert_eq!(theory_rows(&pool).await, 1);
}

#[tokio::test]
async fn save_unknown_resource_is_not_found() {
    let (service, _pool) = service().await;

    match service
        .save("no-such-resource", serde_json::json!({}))
        .await
    {
        Err(TheoryServiceError::NotFound(msg)) => {
            assert!(msg.contains("no-such-resource"), "{msg}")
        }
        other => panic!("ожидали NotFound вместо FK-ошибки, получили {other:?}"),
    }
}

#[tokio::test]
async fn clear_without_row_writes_nothing() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;

    let cleared = service.clear("r-1").await.expect("пустой корень");

    assert_eq!(cleared.created_at, NEVER_SAVED);
    assert_eq!(cleared.updated_at, NEVER_SAVED);
    assert_eq!(theory_rows(&pool).await, 0, "очищать нечего — записи нет");
}

#[tokio::test]
async fn clear_existing_row_keeps_created_at() {
    let (service, pool) = service().await;
    seed_resource(&pool, "c-1", "r-1").await;
    let saved = service
        .save("r-1", serde_json::json!({ "root": { "type": "root" } }))
        .await
        .expect("контент сохранён");

    let cleared = service.clear("r-1").await.expect("контент очищен");

    assert_eq!(cleared.created_at, saved.created_at);
    assert_eq!(cleared.content["root"]["children"][0]["type"], "paragraph");
    assert_eq!(theory_rows(&pool).await, 1);
}
