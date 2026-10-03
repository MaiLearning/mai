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
    let result = result_of(&response);
    let server_info = result["serverInfo"]
        .as_object()
        .expect("serverInfo в ответе initialize");
    assert_eq!(server_info["name"], "mai");
}

/// Инструкции и ресурсы — то, ради чего агент вообще подключается: без них он
/// не знает ни терминов платформы, ни куда идти за справкой.
#[tokio::test]
async fn initialize_advertises_resources_and_ships_instructions() {
    let state = test_state("t");
    let (_, response) = post(
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

    let result = result_of(&response);
    assert!(
        !result["capabilities"]["resources"].is_null(),
        "resources должны быть объявлены: {response}"
    );

    let instructions = result["instructions"]
        .as_str()
        .expect("instructions в ответе initialize");
    assert!(instructions.contains("## Глоссарий"), "{instructions}");
    assert!(
        instructions.contains("mai_course_outline"),
        "{instructions}"
    );
}

#[tokio::test]
async fn resources_list_and_read_guide() {
    let state = test_state("t");

    let (_, listed) = post(
        &state,
        json!({"jsonrpc": "2.0", "id": 2, "method": "resources/list"}),
    )
    .await;
    let uris: Vec<&str> = result_of(&listed)["resources"]
        .as_array()
        .expect("resources в ответе")
        .iter()
        .filter_map(|r| r["uri"].as_str())
        .collect();
    for expected in ["mai://guide/glossary", "mai://guide/workflow"] {
        assert!(
            uris.contains(&expected),
            "нет ресурса '{expected}': {uris:?}"
        );
    }

    let (_, read) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 3,
            "method": "resources/read",
            "params": {"uri": "mai://guide/glossary"}
        }),
    )
    .await;
    let contents = &result_of(&read)["contents"][0];
    assert_eq!(contents["uri"], "mai://guide/glossary");
    assert_eq!(contents["mimeType"], "text/markdown");
    assert!(contents["text"]
        .as_str()
        .expect("text-ресурс")
        .contains("# Глоссарий Mai"));
}

#[tokio::test]
async fn resources_read_unknown_uri_reports_available() {
    let state = test_state("t");
    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 4,
            "method": "resources/read",
            "params": {"uri": "mai://guide/нет"}
        }),
    )
    .await;

    assert!(response.get("error").is_some(), "{response}");
    let message = response["error"]["message"].as_str().unwrap_or_default();
    assert!(message.contains("mai://guide/glossary"), "{message}");
}

#[tokio::test]
async fn tools_list_contains_all_read_only_tools() {
    let state = test_state("t");
    let (_, response) = post(
        &state,
        json!({"jsonrpc": "2.0", "id": 5, "method": "tools/list"}),
    )
    .await;

    let tools = result_of(&response)["tools"]
        .as_array()
        .expect("tools в ответе");
    let names: Vec<&str> = tools.iter().filter_map(|t| t["name"].as_str()).collect();
    for expected in [
        "mai_list_courses",
        "mai_get_course",
        "mai_course_outline",
        "mai_get_resource",
        "mai_get_content",
        "mai_search",
        "mai_list_plugins",
    ] {
        assert!(
            names.contains(&expected),
            "нет tool '{expected}': {names:?}"
        );
    }
    // Схема параметров строится из Args: без неё агент не знает, что передавать.
    let outline = tools
        .iter()
        .find(|t| t["name"] == "mai_course_outline")
        .expect("mai_course_outline в списке");
    let properties = outline["inputSchema"]["properties"]
        .as_object()
        .expect("схема параметров");
    for field in ["courseId", "rootId", "depth", "typeKeys", "maxNodes"] {
        assert!(properties.contains_key(field), "в схеме нет '{field}'");
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
            "id": 6,
            "method": "tools/call",
            "params": {"name": "mai_list_courses", "arguments": {}}
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
    // Краткая карточка не тащит даты и цвета.
    assert!(courses[0].get("createdAt").is_none(), "{text}");
}

#[tokio::test]
async fn unknown_course_returns_tool_level_error() {
    let state = test_state("t");
    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 7,
            "method": "tools/call",
            "params": {
                "name": "mai_get_course",
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

/// Курс + ресурс напрямую в БД: `type_key` ссылается на `resource_types`,
/// поэтому тип объявляется первым. Теорию без существующего ресурса не прочитать.
async fn seed_resource(pool: &sqlx::SqlitePool, course_id: &str, resource_id: &str) {
    seed_resource_of_type(pool, course_id, resource_id, "theory").await;
}

/// То же для ресурса произвольного типа: нужна проверка read-only не только на
/// теории — у задач и кода чтение тоже обязано ничего не материализовать.
async fn seed_resource_of_type(
    pool: &sqlx::SqlitePool,
    course_id: &str,
    resource_id: &str,
    type_key: &str,
) {
    sqlx::query(
        "INSERT OR IGNORE INTO courses (id, name, created_at, updated_at) VALUES (?, 'c', 0, 0)",
    )
    .bind(course_id)
    .execute(pool)
    .await
    .expect("course seeded");

    sqlx::query("INSERT OR IGNORE INTO resource_types (key, name) VALUES (?, ?)")
        .bind(type_key)
        .bind(type_key)
        .execute(pool)
        .await
        .expect("resource type seeded");

    sqlx::query(
        "INSERT INTO resources (id, course_id, name, type_key, created_at, updated_at)
         VALUES (?, ?, 'Лекция', ?, 10, 20)",
    )
    .bind(resource_id)
    .bind(course_id)
    .bind(type_key)
    .execute(pool)
    .await
    .expect("resource seeded");
}

/// Курс с деревом: директория и ресурс внутри неё. Корневой узел ресурса
/// создаёт триггер `trg_resource_create_structure`, поэтому вручную вставляется
/// только узел директории, а узел ресурса переносится под него.
async fn seed_structure(pool: &sqlx::SqlitePool, course_id: &str) {
    seed_resource(pool, course_id, "r-1").await;

    sqlx::query(
        "INSERT INTO directories (id, course_id, name, created_at, updated_at)
         VALUES ('d-1', ?, 'Модуль 1', 0, 0)",
    )
    .bind(course_id)
    .execute(pool)
    .await
    .expect("directory seeded");

    sqlx::query(
        "INSERT INTO structures (id, course_id, parent_id, position, resource_id, directory_id)
         VALUES ('n-d1', ?, NULL, 1, NULL, 'd-1')",
    )
    .bind(course_id)
    .execute(pool)
    .await
    .expect("directory node seeded");

    sqlx::query("UPDATE structures SET parent_id = 'n-d1', position = 0 WHERE id = 'r-1'")
        .execute(pool)
        .await
        .expect("resource node moved under directory");
}

/// `mai_get_content` — read-only: отсутствие контента это ошибка, а не повод
/// материализовать пустой документ в БД.
///
/// Проверяется каждый тип содержимого: у задач и кода сервисы умеют создавать
/// корень лениво (это нужно редактору), и слой MCP обязан брать строгие
/// чтения — иначе агент материализует пустые строки просто чтением.
#[tokio::test]
async fn get_content_does_not_create_content() {
    for (type_key, table) in [
        ("theory", "theory_content"),
        ("task", "task_content"),
        ("code", "code"),
    ] {
        let state = test_state(type_key);
        seed_resource_of_type(&state.pool, "c-1", "r-1", type_key).await;

        let (_, response) = post(
            &state,
            json!({
                "jsonrpc": "2.0",
                "id": 8,
                "method": "tools/call",
                "params": {
                    "name": "mai_get_content",
                    "arguments": {"resourceId": "r-1"}
                }
            }),
        )
        .await;

        let result = result_of(&response);
        assert_eq!(result["isError"], json!(true), "{type_key}: {response}");
        let text = result["content"][0]["text"].as_str().expect("text-контент");
        assert!(
            text.contains("нет сохранённого содержимого"),
            "{type_key}: {text}"
        );

        let rows: i64 = sqlx::query_scalar(&format!("SELECT COUNT(*) FROM {table}"))
            .fetch_one(&state.pool)
            .await
            .unwrap_or_else(|e| panic!("{table} посчитан: {e}"));
        assert_eq!(
            rows, 0,
            "{type_key}: read-only tool не должен создавать строку"
        );
    }
}

/// `mai_get_content` отдаёт сохранённый контент: по умолчанию читаемым текстом.
#[tokio::test]
async fn get_content_returns_stored_content_as_text() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    sqlx::query(
        "INSERT INTO theory_content (resource_id, content, created_at, updated_at) VALUES (?, ?, 10, 20)",
    )
    .bind("r-1")
    .bind(r#"{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Введение"}]},{"type":"paragraph","content":[{"type":"text","text":"Тело лекции."}]}]}"#)
    .execute(&state.pool)
    .await
    .expect("theory row seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 9,
            "method": "tools/call",
            "params": {
                "name": "mai_get_content",
                "arguments": {"resourceId": "r-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    // Текстовая проекция вместо служебной обвязки документа.
    assert!(text.contains("## Введение"), "{text}");
    assert!(text.contains("Тело лекции."), "{text}");
    assert!(
        !text.contains("\"type\":\"doc\""),
        "сырой документ не должен протекать: {text}"
    );
}

/// `format: "json"` — без потерь, с привязкой к ресурсу.
#[tokio::test]
async fn get_content_json_format_is_lossless() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    sqlx::query(
        "INSERT INTO theory_content (resource_id, content, created_at, updated_at) VALUES (?, ?, 10, 20)",
    )
    .bind("r-1")
    .bind(r#"{"type":"doc","content":[{"type":"callout","attrs":{"tone":"warning"},"content":[{"type":"paragraph"}]}]}"#)
    .execute(&state.pool)
    .await
    .expect("theory row seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 10,
            "method": "tools/call",
            "params": {
                "name": "mai_get_content",
                "arguments": {"resourceId": "r-1", "format": "json"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    let payload: Value = serde_json::from_str(text).expect("JSON контента");
    assert_eq!(payload["resourceId"], "r-1");
    assert_eq!(payload["typeKey"], "theory");
    assert_eq!(payload["updatedAt"], json!(20));
    // Выноска в текст не ложится — в json остаётся на месте.
    assert_eq!(payload["content"]["content"][0]["type"], "callout");
    assert_eq!(payload["content"]["content"][0]["attrs"]["tone"], "warning");
}

/// Оглавление отдаёт дерево текстом: id узлов приходят из ответа, а не из БД.
#[tokio::test]
async fn course_outline_renders_tree_with_ids() {
    let state = test_state("t");
    seed_structure(&state.pool, "c-1").await;

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 11,
            "method": "tools/call",
            "params": {
                "name": "mai_course_outline",
                "arguments": {"courseId": "c-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    assert!(text.contains("Модуль 1 [dir n-d1]"), "{text}");
    assert!(text.contains("  Лекция [res r-1 theory upd:20]"), "{text}");
}

/// `mai_search` находит текст содержимого, не требуя его вызова агентом.
#[tokio::test]
async fn search_finds_phrase_inside_theory() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    sqlx::query(
        "INSERT INTO theory_content (resource_id, content, created_at, updated_at) VALUES (?, ?, 10, 20)",
    )
    .bind("r-1")
    .bind(r#"{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Владение памятью в Rust"}]}]}"#)
    .execute(&state.pool)
    .await
    .expect("theory row seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 12,
            "method": "tools/call",
            "params": {
                "name": "mai_search",
                "arguments": {"query": "владение", "courseId": "c-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    assert!(text.contains("\"resourceId\":\"r-1\""), "{text}");
    assert!(text.contains("\"place\":\"content\""), "{text}");
}

/// Ресурс без `typeKey` — не ошибка вызова, но объяснение, что делать.
#[tokio::test]
async fn get_content_without_type_key_is_actionable() {
    let state = test_state("t");
    sqlx::query("INSERT INTO courses (id, name, created_at, updated_at) VALUES ('c-9', 'c', 0, 0)")
        .execute(&state.pool)
        .await
        .expect("course seeded");
    sqlx::query("INSERT INTO resources (id, course_id, name) VALUES ('r-9', 'c-9', 'Без типа')")
        .execute(&state.pool)
        .await
        .expect("resource seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 13,
            "method": "tools/call",
            "params": {
                "name": "mai_get_content",
                "arguments": {"resourceId": "r-9"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(true), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    assert!(text.contains("нет типа"), "{text}");
}

/// Пустые ресурсы в отчёте поиска — счётчиком, а не списком id: иначе курс без
/// содержимого превращает отчёт в стену идентификаторов.
#[tokio::test]
async fn search_reports_empty_resources_as_count() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;
    seed_resource_of_type(&state.pool, "c-1", "r-2", "task").await;
    seed_resource_of_type(&state.pool, "c-1", "r-3", "code").await;

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 14,
            "method": "tools/call",
            "params": {
                "name": "mai_search",
                "arguments": {"query": "владение", "courseId": "c-1"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    assert!(text.contains("без содержимого 3"), "{text}");
    assert!(!text.contains("не прочитано"), "{text}");

    // Поиск остался чистым: ни одна пустая строка не материализована.
    for (table, count) in [("task_content", 0), ("code", 0)] {
        let rows: i64 = sqlx::query_scalar(&format!("SELECT COUNT(*) FROM {table}"))
            .fetch_one(&state.pool)
            .await
            .expect("посчитано");
        assert_eq!(rows, count, "{table} должен остаться пустым");
    }
}

/// Большой документ в `format: "json"` урезается по границе блока и остаётся
/// валидным JSON: резать посередине тела нельзя.
#[tokio::test]
async fn big_theory_json_is_trimmed_and_stays_valid() {
    let state = test_state("t");
    seed_resource(&state.pool, "c-1", "r-1").await;

    let blocks: Vec<Value> = (0..4_000)
        .map(|i| {
            json!({
                "type": "paragraph",
                "content": [{"type": "text", "text": format!("блок {i} {}", "x".repeat(40))}]
            })
        })
        .collect();
    let doc = serde_json::to_string(&json!({"type": "doc", "content": blocks})).expect("doc");

    sqlx::query(
        "INSERT INTO theory_content (resource_id, content, created_at, updated_at) VALUES (?, ?, 10, 20)",
    )
    .bind("r-1")
    .bind(doc)
    .execute(&state.pool)
    .await
    .expect("theory row seeded");

    let (_, response) = post(
        &state,
        json!({
            "jsonrpc": "2.0",
            "id": 15,
            "method": "tools/call",
            "params": {
                "name": "mai_get_content",
                "arguments": {"resourceId": "r-1", "format": "json"}
            }
        }),
    )
    .await;

    let result = result_of(&response);
    assert_eq!(result["isError"], json!(false), "{response}");
    let text = result["content"][0]["text"].as_str().expect("text-контент");
    let payload: Value = serde_json::from_str(text).expect("ответ — валидный JSON");

    let truncation = &payload["truncated"];
    assert_eq!(truncation["total"], json!(4_000));
    assert!(
        truncation["shown"].as_u64().expect("shown") < 4_000,
        "должно быть урезано: {truncation}"
    );
    assert!(
        truncation["hint"].as_str().is_some_and(|h| !h.is_empty()),
        "у обрезки должна быть подсказка"
    );

    let returned = payload["content"]["content"].as_array().expect("блоки");
    assert_eq!(returned.len() as u64, truncation["shown"].as_u64().unwrap());
}
