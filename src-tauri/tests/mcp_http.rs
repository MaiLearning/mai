//! Интеграционный тест MCP-каркаса.
//!
//! MCP-сервис — tower `Service`, поэтому он дёргается `oneshot`'ом напрямую:
//! без запущенного приложения, HTTP-сервера и дисплея. Stateless-режим
//! (`legacy_session_mode = false`) + `json_response = true` превращают каждый
//! POST в простой request→response — это и есть контракт для AI-агентов.

use std::sync::Arc;

use axum::body::Body;
use http::{Request, StatusCode};
use http_body_util::BodyExt;
use serde_json::{json, Value};
use sqlx::sqlite::SqliteConnectOptions;
use tower::ServiceExt;

use mai_lib::database::sqlite::migration::MigrationRunner;
use mai_lib::database::sqlite::repositories::course::SqliteCourseRepository;
use mai_lib::server::mcp;
use mai_lib::server::state::AppState;
use mai_lib::services::course::{CourseData, CourseService};
use mai_lib::services::events::{ChangePublisher, EntityChanged, SharedChangePublisher};
use mai_lib::utils::paths::AppPaths;

/// Паблишер-заглушка: тесты читающие, событий не публикуют.
#[derive(Default)]
struct NoopPublisher;

impl ChangePublisher for NoopPublisher {
    fn publish(&self, _event: EntityChanged) {}
}

/// Уникальный каталог на тест: миграции параллельных тестов не должны
/// гоняться за одним db-файлом.
fn unique_dir(tag: &str) -> std::path::PathBuf {
    use std::sync::atomic::{AtomicU32, Ordering};
    static NEXT: AtomicU32 = AtomicU32::new(0);
    let n = NEXT.fetch_add(1, Ordering::Relaxed);
    std::env::temp_dir().join(format!("mai-mcp-test-{}-{tag}-{n}", std::process::id()))
}

fn test_state(tag: &str) -> AppState {
    let dir = unique_dir(tag);
    std::fs::create_dir_all(&dir).expect("failed to create test dir");
    let db_path = dir.join("mai.db");
    MigrationRunner::new().run(&db_path);

    let options = SqliteConnectOptions::new()
        .filename(&db_path)
        .create_if_missing(true);
    let pool = sqlx::SqlitePool::connect_lazy_with(options);

    let app_paths = AppPaths {
        app_data_dir: dir.clone(),
        storage_dir: dir.join("storage"),
        plugins_dir: dir.join("plugins"),
        courses_dir: dir.join("courses"),
    };
    let publisher: SharedChangePublisher = Arc::new(NoopPublisher);
    AppState {
        pool,
        app_paths,
        publisher,
    }
}

/// POST JSON-RPC сообщения в MCP-сервис, ответ — разобранный JSON.
async fn post(state: &AppState, message: Value) -> (StatusCode, Value) {
    let service = mcp::service(state.clone());
    let request = Request::builder()
        .method("POST")
        .uri("/mcp")
        .header("host", "localhost")
        .header("content-type", "application/json")
        .header("accept", "application/json, text/event-stream")
        .body(Body::from(message.to_string()))
        .expect("valid request");

    let response = service.oneshot(request).await.expect("service responds");
    let status = response.status();
    let bytes = response
        .into_body()
        .collect()
        .await
        .expect("body collects")
        .to_bytes();
    let parsed: Value = serde_json::from_slice(&bytes).unwrap_or_else(|e| {
        panic!(
            "response is JSON: {e}; raw: {:?}",
            String::from_utf8_lossy(&bytes)
        )
    });
    (status, parsed)
}

fn result_of(response: &Value) -> &Value {
    response
        .get("result")
        .expect("JSON-RPC result должен присутствовать")
}

#[tokio::test]
async fn initialize_returns_server_info_named_mai() {
    let state = test_state("t");
    let (status, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-03-26",
                "capabilities": {},
                "clientInfo": {"name": "mcp-test", "version": "0.0.0"}
            }
        }),
    )
    .await;

    assert_eq!(status, StatusCode::OK);
    let server_info = result_of(&response)["serverInfo"]
        .as_object()
        .expect("serverInfo в ответе initialize");
    assert_eq!(server_info["name"], "mai");
}

#[tokio::test]
async fn tools_list_contains_all_read_only_tools() {
    let state = test_state("t");
    let (_, response) = post(
        &state,
        json!({"jsonrpc": "2.0", "id": 2, "method": "tools/list"}),
    )
    .await;

    let tools = result_of(&response)["tools"]
        .as_array()
        .expect("tools в ответе");
    let names: Vec<&str> = tools.iter().filter_map(|t| t["name"].as_str()).collect();
    for expected in [
        "list_courses",
        "get_course",
        "get_course_structure",
        "get_resource",
        "get_theory",
        "list_plugins",
    ] {
        assert!(
            names.contains(&expected),
            "нет tool '{expected}': {names:?}"
        );
    }
}

#[tokio::test]
async fn list_courses_reflects_created_course() {
    let state = test_state("t");

    let repo = Arc::new(SqliteCourseRepository::new(state.pool.clone()));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());
    service
        .create(CourseData {
            id: "course-1".to_string(),
            name: "Rust: практика".to_string(),
            description: Some("Тестовый курс".to_string()),
            tags: vec!["rust".to_string()],
            color_from: None,
            color_to: None,
            status: "draft".to_string(),
            created_at: 1,
            updated_at: 1,
        })
        .await
        .expect("course created");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {"name": "list_courses", "arguments": {}}
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(
        result["isError"],
        json!(false),
        "успешный вызов: {response}"
    );
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    let courses: Value = serde_json::from_str(text).expect("JSON курсов");
    assert_eq!(courses[0]["name"], "Rust: практика");
}

#[tokio::test]
async fn unknown_course_returns_tool_level_error() {
    let state = test_state("t");
    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 4,
            "method": "tools/call",
            "params": {
                "name": "get_course",
                "arguments": {"courseId": "no-such-course"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(
        result["isError"],
        json!(true),
        "ошибка доходит текстом: {response}"
    );
}

/// Курс + ресурс напрямую в БД: теорию без существующего ресурса не прочитать.
async fn seed_resource(pool: &sqlx::SqlitePool, course_id: &str, resource_id: &str) {
    sqlx::query("INSERT INTO courses (id, name, created_at, updated_at) VALUES (?, 'c', 0, 0)")
        .bind(course_id)
        .execute(pool)
        .await
        .expect("course seeded");

    sqlx::query("INSERT INTO resources (id, course_id, name) VALUES (?, ?, 'theory')")
        .bind(resource_id)
        .bind(course_id)
        .execute(pool)
        .await
        .expect("resource seeded");
}

/// get_theory — read-only: отсутствие контента это ошибка, а не повод
/// материализовать пустой корень в БД.
#[tokio::test]
async fn get_theory_does_not_create_content() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 5,
            "method": "tools/call",
            "params": {
                "name": "get_theory",
                "arguments": {"resourceId": "r-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(true), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    assert!(text.contains("Not found"), "{text}");

    let rows: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM theory_content")
        .fetch_one(&state.pool)
        .await
        .expect("theory_content посчитан");
    assert_eq!(rows, 0, "read-only tool не должен создавать строку");
}

/// get_theory отдаёт сохранённый контент (позитивная ветка строгого чтения).
#[tokio::test]
async fn get_theory_returns_stored_content() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    sqlx::query(
        "INSERT INTO theory_content (resource_id, content, created_at, updated_at) VALUES (?, ?, 10, 20)",
    )
    .bind("r-1")
    .bind(r#"{"root":{"type":"root"}}"#)
    .execute(&state.pool)
    .await
    .expect("theory row seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 6,
            "method": "tools/call",
            "params": {
                "name": "get_theory",
                "arguments": {"resourceId": "r-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    let content: Value = serde_json::from_str(text).expect("JSON контента теории");
    assert_eq!(content["resourceId"], "r-1");
    assert_eq!(content["updatedAt"], json!(20));
    assert_eq!(content["content"]["root"]["type"], "root");
}
