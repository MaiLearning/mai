//! Интеграционные тесты хранилища link-плагина на SQLite:
//! реальные миграции, пул и SQL. У каждого теста — своя временная БД.

use super::SqliteLinkRepository;
use crate::database::repository::link::LinkRepository;
use crate::database::repository::RepoError;
use crate::database::sqlite::migration::MigrationRunner;
use crate::database::sqlite::pool::create_pool;
use crate::database::sqlite::settings::DatabaseConfig;
use crate::plugins::link::service::data::{LinkData, LinkStatus, LinkTargetData};

/// Репозиторий на свежей БД с прогнанными миграциями.
async fn repo() -> SqliteLinkRepository {
    let config = DatabaseConfig::for_test();
    MigrationRunner::new().run(&config.url);
    let pool = create_pool(&config).await;
    SqliteLinkRepository::new(pool)
}

/// Репозиторий + пул (для расстановки вспомогательных данных напрямую).
async fn repo_with_pool() -> (SqliteLinkRepository, sqlx::SqlitePool) {
    let config = DatabaseConfig::for_test();
    MigrationRunner::new().run(&config.url);
    let pool = create_pool(&config).await;
    let repo = SqliteLinkRepository::new(pool.clone());
    (repo, pool)
}

/// Заготовка ребра с фиксированными полями.
fn link(id: &str, source_type: &str, source_id: &str, target: LinkTargetData) -> LinkData {
    LinkData {
        id: id.into(),
        source_type: source_type.into(),
        source_id: source_id.into(),
        target,
        owner_plugin_id: "internal-link".into(),
        title: Some("t".into()),
        description: None,
        created_at: 100,
        updated_at: 100,
        target_status: LinkStatus::Ok,
    }
}

/// Вставляет курс и ресурсы (для JOIN-запросов list_by_course).
async fn seed_course_resources(pool: &sqlx::SqlitePool, course_id: &str, resource_ids: &[&str]) {
    sqlx::query("INSERT INTO courses (id, name, created_at, updated_at) VALUES (?, 'c', 0, 0)")
        .bind(course_id)
        .execute(pool)
        .await
        .unwrap();
    for rid in resource_ids {
        sqlx::query("INSERT INTO resources (id, course_id, name) VALUES (?, ?, 'r')")
            .bind(rid)
            .bind(course_id)
            .execute(pool)
            .await
            .unwrap();
    }
}

#[tokio::test]
async fn insert_get_roundtrip_all_targets() {
    let repo = repo().await;

    let cases: Vec<LinkTargetData> = vec![
        LinkTargetData::Resource {
            course_id: "c-1".into(),
            resource_id: "r-1".into(),
        },
        LinkTargetData::Course {
            course_id: "c-2".into(),
        },
        LinkTargetData::Uri {
            uri: "https://example.com".into(),
        },
    ];
    for (i, target) in cases.into_iter().enumerate() {
        let data = link(&format!("l-{}", i), "course", "c-1", target);
        repo.insert(data.clone()).await.unwrap();

        let stored = repo.get(&data.id).await.unwrap();
        assert_eq!(stored, data);
    }

    assert!(matches!(
        repo.get("missing").await,
        Err(RepoError::NotFound(_))
    ));
}

#[tokio::test]
async fn update_rewrites_target_and_changed_fields_only() {
    let repo = repo().await;
    let data = link(
        "l-1",
        "resource",
        "r-1",
        LinkTargetData::Uri {
            uri: "https://old.example.com".into(),
        },
    );
    repo.insert(data.clone()).await.unwrap();

    let mut updated = data.clone();
    updated.title = Some("новый заголовок".into());
    updated.description = Some("описание".into());
    updated.target = LinkTargetData::Course {
        course_id: "c-9".into(),
    };
    updated.updated_at = 200;
    repo.update(updated).await.unwrap();

    let stored = repo.get("l-1").await.unwrap();
    assert_eq!(stored.title.as_deref(), Some("новый заголовок"));
    assert_eq!(stored.description.as_deref(), Some("описание"));
    assert_eq!(
        stored.target,
        LinkTargetData::Course {
            course_id: "c-9".into()
        }
    );
    assert_eq!(stored.updated_at, 200);
    assert_eq!(stored.created_at, 100); // неизменяемое поле
    assert_eq!(stored.source_id, "r-1");

    assert!(matches!(
        repo.update(link(
            "missing",
            "course",
            "c-1",
            LinkTargetData::Uri { uri: "x:y".into() }
        ))
        .await,
        Err(RepoError::NotFound(_))
    ));
}

#[tokio::test]
async fn list_by_source_filters_by_type_and_id() {
    let repo = repo().await;
    let target = LinkTargetData::Uri {
        uri: "https://x".into(),
    };
    repo.insert(link("l-1", "resource", "r-1", target.clone()))
        .await
        .unwrap();
    repo.insert(link("l-2", "resource", "r-2", target.clone()))
        .await
        .unwrap();
    repo.insert(link("l-3", "course", "r-1", target.clone()))
        .await
        .unwrap();

    let ids: Vec<String> = repo
        .list_by_source("resource", "r-1")
        .await
        .unwrap()
        .into_iter()
        .map(|l| l.id)
        .collect();
    assert_eq!(ids, vec!["l-1".to_string()]);
}

#[tokio::test]
async fn list_by_target_matches_kind_and_value() {
    let repo = repo().await;
    repo.insert(link(
        "l-1",
        "course",
        "c-1",
        LinkTargetData::Resource {
            course_id: "c-9".into(),
            resource_id: "r-9".into(),
        },
    ))
    .await
    .unwrap();
    repo.insert(link(
        "l-2",
        "course",
        "c-1",
        LinkTargetData::Resource {
            course_id: "c-9".into(),
            resource_id: "r-other".into(),
        },
    ))
    .await
    .unwrap();
    repo.insert(link(
        "l-3",
        "course",
        "c-1",
        LinkTargetData::Course {
            course_id: "c-9".into(),
        },
    ))
    .await
    .unwrap();

    let ids: Vec<String> = repo
        .list_by_target(&LinkTargetData::Resource {
            course_id: "c-9".into(),
            resource_id: "r-9".into(),
        })
        .await
        .unwrap()
        .into_iter()
        .map(|l| l.id)
        .collect();
    assert_eq!(ids, vec!["l-1".to_string()]);

    let ids: Vec<String> = repo
        .list_by_target(&LinkTargetData::Course {
            course_id: "c-9".into(),
        })
        .await
        .unwrap()
        .into_iter()
        .map(|l| l.id)
        .collect();
    assert_eq!(ids, vec!["l-3".to_string()]);

    assert!(repo
        .list_by_target(&LinkTargetData::Uri {
            uri: "https://none".into()
        })
        .await
        .unwrap()
        .is_empty());
}

#[tokio::test]
async fn list_by_course_includes_course_and_its_resources() {
    let (repo, pool) = repo_with_pool().await;
    let target = LinkTargetData::Uri {
        uri: "https://x".into(),
    };
    // Ребро от курса c-1
    repo.insert(link("l-course", "course", "c-1", target.clone()))
        .await
        .unwrap();
    // Ребро от ресурса курса c-1
    repo.insert(link("l-res", "resource", "r-1", target.clone()))
        .await
        .unwrap();
    // Ребро от ресурса другого курса (ресурс есть, но course_id другой)
    repo.insert(link("l-foreign", "resource", "r-x", target.clone()))
        .await
        .unwrap();

    seed_course_resources(&pool, "c-1", &["r-1"]).await;

    let ids: Vec<String> = repo
        .list_by_course("c-1")
        .await
        .unwrap()
        .into_iter()
        .map(|l| l.id)
        .collect();
    assert_eq!(ids, vec!["l-course".to_string(), "l-res".to_string()]);
}

#[tokio::test]
async fn source_refs_distinct_and_delete_by_ids() {
    let repo = repo().await;
    let target = LinkTargetData::Uri {
        uri: "https://x".into(),
    };
    repo.insert(link("l-1", "resource", "r-1", target.clone()))
        .await
        .unwrap();
    repo.insert(link("l-2", "resource", "r-1", target.clone()))
        .await
        .unwrap();
    repo.insert(link("l-3", "course", "c-1", target.clone()))
        .await
        .unwrap();

    let refs = repo.list_source_refs().await.unwrap();
    assert_eq!(refs.len(), 2, "distinct по паре (source_type, source_id)");
    assert!(
        refs.contains(&crate::plugins::link::service::data::LinkSourceRef {
            source_type: "resource".into(),
            source_id: "r-1".into(),
        })
    );
    assert!(
        refs.contains(&crate::plugins::link::service::data::LinkSourceRef {
            source_type: "course".into(),
            source_id: "c-1".into(),
        })
    );

    let removed = repo
        .delete_by_ids(&["l-1".into(), "l-3".into(), "missing".into()])
        .await
        .unwrap();
    assert_eq!(removed, 2);
    assert!(matches!(repo.get("l-1").await, Err(RepoError::NotFound(_))));
    assert_eq!(repo.delete_by_ids(&[]).await.unwrap(), 0);
}
