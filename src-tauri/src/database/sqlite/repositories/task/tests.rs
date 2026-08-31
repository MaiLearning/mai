//! Интеграционные тесты гранулярного хранилища task-плагина на SQLite:
//! реальные миграции, пул и SQL. У каждого теста — своя временная БД.

use std::collections::BTreeMap;

use super::SqliteTaskRepository;
use crate::database::repository::task::TaskRepository;
use crate::database::sqlite::migration::MigrationRunner;
use crate::database::sqlite::pool::create_pool;
use crate::database::sqlite::settings::DatabaseConfig;
use crate::plugins::task::service::data::{
    default_task, CustomDifficultyData, TaskAnswerData, TaskKind, TaskKindData, TaskResultData,
};

/// Репозиторий на свежей БД с прогнанными миграциями + ресурс-владелец.
async fn seeded_repo() -> (SqliteTaskRepository, String) {
    let config = DatabaseConfig::for_test();
    MigrationRunner::new().run(&config.url);
    let pool = create_pool(&config).await;

    let course_id = uuid::Uuid::new_v4().to_string();
    sqlx::query("INSERT INTO courses (id, name, created_at, updated_at) VALUES (?, 't', 0, 0)")
        .bind(&course_id)
        .execute(&pool)
        .await
        .unwrap();

    let resource_id = uuid::Uuid::new_v4().to_string();
    sqlx::query("INSERT INTO resources (id, course_id, name) VALUES (?, ?, 'task')")
        .bind(&resource_id)
        .bind(&course_id)
        .execute(&pool)
        .await
        .unwrap();

    (SqliteTaskRepository::new(pool), resource_id)
}

#[tokio::test]
async fn snapshot_creates_root_once() {
    let (repo, resource_id) = seeded_repo().await;

    let first = repo.snapshot(&resource_id).await.unwrap();
    assert!(first.created_at > 0 && first.updated_at > 0);
    assert!(first.content.tasks.is_empty());

    tokio::time::sleep(std::time::Duration::from_millis(5)).await;
    let second = repo.snapshot(&resource_id).await.unwrap();
    assert_eq!(first.created_at, second.created_at);
    assert_eq!(first.updated_at, second.updated_at);
}

#[tokio::test]
async fn create_task_defaults_match_contract() {
    let (repo, resource_id) = seeded_repo().await;

    for kind in TaskKind::ALL {
        let task = repo
            .create_task(
                &resource_id,
                default_task(uuid::Uuid::new_v4().to_string(), kind),
            )
            .await
            .unwrap();

        match &task.kind {
            TaskKindData::SingleChoice { choices } => {
                assert_eq!(choices.len(), 1);
                assert_eq!(choices[0].id, "a");
                assert!(choices[0].correct);
            }
            TaskKindData::MultipleChoice { choices } => {
                assert_eq!(choices.len(), 2);
                assert!(choices[0].correct);
                assert!(!choices[1].correct);
            }
            TaskKindData::TrueFalse { answer } => assert!(*answer),
            TaskKindData::Matching { pairs } => assert_eq!(pairs.len(), 2),
            TaskKindData::Ordering { items } => assert_eq!(items.len(), 2),
            TaskKindData::FillInBlank { segments } => {
                assert_eq!(segments.len(), 1);
                assert!(segments[0].blank.is_none());
            }
            TaskKindData::OpenAnswer {
                sample_answer,
                placeholder,
            } => {
                assert!(sample_answer.is_empty());
                assert!(placeholder.is_empty());
            }
        }
    }

    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert_eq!(snap.content.tasks.len(), TaskKind::ALL.len());
}

#[tokio::test]
async fn answers_roundtrip_all_kinds() {
    let (repo, resource_id) = seeded_repo().await;

    let cases: Vec<(TaskKind, TaskAnswerData)> = vec![
        (
            TaskKind::SingleChoice,
            TaskAnswerData::SingleChoice {
                choice_id: Some("a".into()),
            },
        ),
        (
            TaskKind::TrueFalse,
            TaskAnswerData::TrueFalse { value: Some(false) },
        ),
        (
            TaskKind::Matching,
            TaskAnswerData::Matching {
                mapping: BTreeMap::from([("p1".into(), "p2".into()), ("p3".into(), "p4".into())]),
            },
        ),
        (
            TaskKind::Ordering,
            TaskAnswerData::Ordering {
                item_ids: vec!["i3".into(), "i1".into()],
            },
        ),
        (
            TaskKind::FillInBlank,
            TaskAnswerData::FillInBlank {
                values: BTreeMap::from([("s1".into(), "x".into()), ("s2".into(), "y".into())]),
            },
        ),
        (
            TaskKind::OpenAnswer,
            TaskAnswerData::OpenAnswer {
                text: "ответ".into(),
            },
        ),
    ];

    for (kind, answer) in cases {
        let task = repo
            .create_task(
                &resource_id,
                default_task(uuid::Uuid::new_v4().to_string(), kind),
            )
            .await
            .unwrap();
        repo.upsert_progress(&task.id, answer.clone())
            .await
            .unwrap();

        let snap = repo.snapshot(&resource_id).await.unwrap();
        assert_eq!(
            snap.content.answers.get(&task.id),
            Some(&answer),
            "kind {}",
            kind.as_str()
        );
    }
}

#[tokio::test]
async fn answer_result_attempt_flow() {
    let (repo, resource_id) = seeded_repo().await;
    let task = repo
        .create_task(
            &resource_id,
            default_task(uuid::Uuid::new_v4().to_string(), TaskKind::MultipleChoice),
        )
        .await
        .unwrap();

    repo.upsert_progress(
        &task.id,
        TaskAnswerData::MultipleChoice {
            choice_ids: vec!["b".into(), "a".into()],
        },
    )
    .await
    .unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert!(!snap.content.results.contains_key(&task.id));
    assert!(!snap.content.completed.contains_key(&task.id));

    repo.set_task_result(
        &task.id,
        Some(TaskAnswerData::MultipleChoice {
            choice_ids: vec!["a".into()],
        }),
        TaskResultData::Correct,
    )
    .await
    .unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert_eq!(
        snap.content.results.get(&task.id),
        Some(&TaskResultData::Correct)
    );
    assert_eq!(snap.content.completed.get(&task.id), Some(&true));
    // upsert перезаписал детей ответа
    assert_eq!(
        snap.content.answers.get(&task.id),
        Some(&TaskAnswerData::MultipleChoice {
            choice_ids: vec!["a".into()]
        })
    );

    let attempts = repo.attempts(&task.id).await.unwrap();
    assert_eq!(attempts.len(), 1);
    assert_eq!(attempts[0].seq, 1);
    assert_eq!(attempts[0].result, TaskResultData::Correct);
    assert_eq!(
        attempts[0].answer,
        Some(TaskAnswerData::MultipleChoice {
            choice_ids: vec!["a".into()]
        })
    );

    // Вторая попытка без ответа: kind = kind задачи, скаляры пустые
    repo.set_task_result(&task.id, None, TaskResultData::Incorrect)
        .await
        .unwrap();
    let attempts = repo.attempts(&task.id).await.unwrap();
    assert_eq!(attempts.len(), 2);
    assert_eq!(attempts[1].seq, 2);
    assert_eq!(attempts[1].result, TaskResultData::Incorrect);
    assert!(attempts[1].answer.is_none());

    // Рестарт: ответ и result сброшены; completed и попытки сохранены
    repo.reset_progress(&task.id).await.unwrap();
    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert!(!snap.content.answers.contains_key(&task.id));
    assert!(!snap.content.results.contains_key(&task.id));
    assert_eq!(snap.content.completed.get(&task.id), Some(&true));
    assert_eq!(repo.attempts(&task.id).await.unwrap().len(), 2);
}

#[tokio::test]
async fn update_task_rewrites_children_and_resets_progress() {
    let (repo, resource_id) = seeded_repo().await;
    let mut task = repo
        .create_task(
            &resource_id,
            default_task(uuid::Uuid::new_v4().to_string(), TaskKind::SingleChoice),
        )
        .await
        .unwrap();
    repo.upsert_progress(
        &task.id,
        TaskAnswerData::SingleChoice {
            choice_id: Some("a".into()),
        },
    )
    .await
    .unwrap();

    // Смена вида: новые дети, скаляры старого вида очищены, прогресс удалён
    let task_id = task.id.clone();
    task.kind = TaskKindData::OpenAnswer {
        sample_answer: "s".into(),
        placeholder: "p".into(),
    };
    repo.update_task(&task_id, task).await.unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert!(!snap.content.answers.contains_key(&snap.content.tasks[0].id));
    match &snap.content.tasks[0].kind {
        TaskKindData::OpenAnswer {
            sample_answer,
            placeholder,
        } => {
            assert_eq!(sample_answer, "s");
            assert_eq!(placeholder, "p");
        }
        other => panic!("unexpected kind: {:?}", other),
    }
}

#[tokio::test]
async fn delete_task_renormalizes_positions() {
    let (repo, resource_id) = seeded_repo().await;
    let t1 = repo
        .create_task(
            &resource_id,
            default_task(uuid::Uuid::new_v4().to_string(), TaskKind::TrueFalse),
        )
        .await
        .unwrap();
    let t2 = repo
        .create_task(
            &resource_id,
            default_task(uuid::Uuid::new_v4().to_string(), TaskKind::TrueFalse),
        )
        .await
        .unwrap();
    let t3 = repo
        .create_task(
            &resource_id,
            default_task(uuid::Uuid::new_v4().to_string(), TaskKind::TrueFalse),
        )
        .await
        .unwrap();

    repo.delete_task(&t2.id).await.unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    let ids: Vec<&str> = snap.content.tasks.iter().map(|t| t.id.as_str()).collect();
    assert_eq!(ids, vec![t1.id.as_str(), t3.id.as_str()]);
}

#[tokio::test]
async fn set_difficulties_replaces_all() {
    let (repo, resource_id) = seeded_repo().await;

    repo.set_difficulties(
        &resource_id,
        vec![
            CustomDifficultyData {
                id: "d1".into(),
                label: "Лёгкая".into(),
                color: "#0f0".into(),
            },
            CustomDifficultyData {
                id: "d2".into(),
                label: "Сложная".into(),
                color: "#f00".into(),
            },
        ],
    )
    .await
    .unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    let ids: Vec<&str> = snap
        .content
        .difficulties
        .iter()
        .map(|d| d.id.as_str())
        .collect();
    assert_eq!(ids, vec!["d1", "d2"]);

    repo.set_difficulties(
        &resource_id,
        vec![CustomDifficultyData {
            id: "d3".into(),
            label: "Новая".into(),
            color: "#00f".into(),
        }],
    )
    .await
    .unwrap();

    let snap = repo.snapshot(&resource_id).await.unwrap();
    assert_eq!(snap.content.difficulties.len(), 1);
    assert_eq!(snap.content.difficulties[0].id, "d3");
}
