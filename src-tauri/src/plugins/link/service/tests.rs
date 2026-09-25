//! Сервисные тесты link-плагина: контрактный `delete_source_links`
//! на реальной БД (миграции + пул); события собирает записывающий паблишер.

use std::sync::{Arc, Mutex};

use super::{LinkService, LinkServiceError};
use crate::database::sqlite::migration::MigrationRunner;
use crate::database::sqlite::pool::create_pool;
use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::database::sqlite::repositories::link::SqliteLinkRepository;
use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::settings::DatabaseConfig;
use crate::plugins::link::service::data::{CreateLinkData, LinkTargetData};
use crate::services::events::{
    ChangeAction, ChangePublisher, EntityChanged, EntityKind, SharedChangePublisher,
};

/// Записывающий паблишер: копит события для проверок.
#[derive(Default)]
struct Recorder {
    events: Mutex<Vec<EntityChanged>>,
}

impl ChangePublisher for Recorder {
    fn publish(&self, event: EntityChanged) {
        self.events.lock().unwrap().push(event);
    }
}

/// Сервис на свежей БД с прогнанными миграциями + записывающий паблишер + пул.
async fn service() -> (LinkService, Arc<Recorder>, sqlx::SqlitePool) {
    let config = DatabaseConfig::for_test();
    MigrationRunner::new().run(&config.path);
    let pool = create_pool(&config.path, config.max_connections).await;
    let recorder = Arc::new(Recorder::default());
    let publisher: SharedChangePublisher = recorder.clone();
    let service = LinkService::new(
        Arc::new(SqliteLinkRepository::new(pool.clone())),
        Arc::new(SqliteResourceRepository::new(pool.clone())),
        Arc::new(SqliteCourseRepository::new(pool.clone())),
        Arc::new(SqlitePluginRepository::new(pool.clone())),
        publisher,
    );
    (service, recorder, pool)
}

/// Регистрирует internal-плагин (валидация владельцев/caller'ов идёт по
/// plugins + kind-таблицам, как в PluginRepository::get).
async fn seed_plugin(pool: &sqlx::SqlitePool, id: &str) {
    sqlx::query(
        "INSERT INTO plugins (id, name, version, enabled, installed_at, updated_at) \
         VALUES (?, ?, '0.1.0', 1, 0, 0)",
    )
    .bind(id)
    .bind(id)
    .execute(pool)
    .await
    .unwrap();
    sqlx::query("INSERT INTO internal_plugins (plugin_id) VALUES (?)")
        .bind(id)
        .execute(pool)
        .await
        .unwrap();
}

/// Заготовка входа создания ребра от курса-источника c внешним URI-целью.
/// id ребро получает от сервиса (uuid).
fn link(owner: &str) -> CreateLinkData {
    CreateLinkData {
        source_type: "course".into(),
        source_id: "c-1".into(),
        target: LinkTargetData::Uri {
            uri: "https://example.com".into(),
        },
        owner_plugin_id: owner.into(),
        title: Some("t".into()),
        description: None,
    }
}

#[tokio::test]
async fn delete_source_links_removes_all_owner_edges_and_publishes() {
    let (service, recorder, pool) = service().await;
    seed_plugin(&pool, "caller").await;
    seed_plugin(&pool, "other").await;
    let first = service.create(link("caller")).await.unwrap();
    let second = service.create(link("other")).await.unwrap();

    let removed = service
        .delete_source_links("course", "c-1", "caller")
        .await
        .unwrap();

    assert_eq!(removed, 2);
    let remaining = service.list_links("course", "c-1").await.unwrap();
    assert!(remaining.is_empty());

    let events = recorder.events.lock().unwrap();
    let deleted: Vec<&EntityChanged> = events
        .iter()
        .filter(|e| e.action == ChangeAction::Deleted)
        .collect();
    assert_eq!(deleted.len(), 2);
    for event in deleted.iter() {
        assert_eq!(event.entity, EntityKind::Link);
        assert_eq!(event.course_id.as_deref(), Some("c-1"));
    }
    let ids: Vec<&str> = deleted.iter().map(|e| e.id.as_str()).collect();
    assert!(
        ids.contains(&first.id.as_str()) && ids.contains(&second.id.as_str()),
        "события должны ссылаться на удалённые рёбра"
    );
}

#[tokio::test]
async fn delete_source_links_rejects_unregistered_caller() {
    let (service, _recorder, _pool) = service().await;

    let error = service
        .delete_source_links("course", "c-1", "app")
        .await
        .unwrap_err();

    assert!(matches!(error, LinkServiceError::Forbidden(_)));
}

#[tokio::test]
async fn delete_source_links_is_idempotent_on_empty_source() {
    let (service, recorder, pool) = service().await;
    seed_plugin(&pool, "caller").await;

    let removed = service
        .delete_source_links("course", "missing", "caller")
        .await
        .unwrap();

    assert_eq!(removed, 0);
    assert!(recorder.events.lock().unwrap().is_empty());
}
