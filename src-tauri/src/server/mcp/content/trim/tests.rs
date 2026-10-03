//! Тесты структурной обрезки содержимого.

use super::*;
use serde_json::json;

const TASK: TrimPaths<'static> = TrimPaths {
    items: "tasks",
    keyed_maps: &["answers", "results", "completed"],
    id: "id",
};

fn big_task_doc(count: usize) -> Value {
    json!({
        "tasks": (0..count)
            .map(|i| json!({"id": format!("t{i}"), "prompt": "x".repeat(200)}))
            .collect::<Vec<_>>(),
        "difficulties": [],
        "answers": (0..count)
            .map(|i| (format!("t{i}"), json!({"kind": "text", "text": "a"})))
            .collect::<Map<_, _>>(),
        "results": (0..count)
            .map(|i| (format!("t{i}"), json!("correct")))
            .collect::<Map<_, _>>(),
        "completed": (0..count)
            .map(|i| (format!("t{i}"), json!(true)))
            .collect::<Map<_, _>>(),
    })
}

#[test]
fn обрезает_по_элементам_и_сохраняет_согласованность_карт() {
    let raw = big_task_doc(10);
    let trimmed = trim_by_items(&raw, &TASK, 700).expect("обрезано");

    assert_eq!(trimmed.total, 10);
    assert!(trimmed.shown < 10, "обрезать должно было");

    let ids: Vec<&str> = trimmed.value["tasks"]
        .as_array()
        .expect("tasks — массив")
        .iter()
        .filter_map(|t| t["id"].as_str())
        .collect();

    for map_path in TASK.keyed_maps {
        let map = trimmed.value[*map_path]
            .as_object()
            .expect("карта — объект");
        for id in &ids {
            assert!(map.contains_key(*id), "{map_path} потерял {id}");
        }
        for key in map.keys() {
            assert!(ids.contains(&key.as_str()), "{map_path} оставил {key}");
        }
    }
}

#[test]
fn результат_остаётся_валидным_json() {
    let raw = big_task_doc(10);
    let trimmed = trim_by_items(&raw, &TASK, 500).expect("обрезано");

    let reparsed: Value =
        serde_json::from_str(&serde_json::to_string(&trimmed.value).expect("сериализация"))
            .expect("разбор обрезанного документа");
    assert_eq!(
        reparsed["tasks"].as_array().map(Vec::len),
        Some(trimmed.shown)
    );
    assert_eq!(trimmed.value["difficulties"], json!([]));
}

#[test]
fn не_обрезает_что_нечего() {
    assert!(trim_by_items(&json!({"tasks": [1]}), &TASK, 10).is_none());
    assert!(trim_by_items(&json!({"tasks": []}), &TASK, 10).is_none());
    assert!(trim_by_items(&json!({"other": [1, 2, 3]}), &TASK, 10).is_none());
    assert!(trim_by_items(&json!([]), &TASK, 10).is_none());
}

#[test]
fn в_бюджет_влезает_весь_документ() {
    let raw = big_task_doc(3);
    assert!(trim_by_items(&raw, &TASK, 100_000).is_none());
}

#[test]
fn элемент_без_id_не_ломает_обрезку() {
    let raw = json!({
        "tasks": [
            {"id": "t1", "prompt": "a"},
            {"prompt": "b"},
            {"id": "t3", "prompt": "c"},
        ],
        "answers": {"t1": 1, "t3": 3},
    });
    let trimmed = trim_by_items(&raw, &TASK, 1).expect("обрезано");

    assert_eq!(trimmed.shown, 1);
    assert_eq!(trimmed.value["answers"], json!({"t1": 1}));
}
