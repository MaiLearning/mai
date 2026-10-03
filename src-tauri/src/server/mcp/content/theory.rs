//! Проекция теории: документ редактора → читаемый текст.
//!
//! Хранится контент как документ TipTap (ProseMirror JSON). Отдавать его
//! агенту как есть нельзя: в отступах и обвязке на каждую строку текста
//! уходит в разы больше символов, чем в самом тексте, и модель тратит
//! контекст на разбор служебных полей. Текстовая проекция — в разы короче и
//! читается напрямую.
//!
//! Проекция **безвозвратна**: `callout`, `formula`, `embed`, `wikiLink`,
//! подсветка и подчёркивание в текст не ложатся. Поэтому `format: "text"` —
//! для понимания содержимого, а для точной работы с документом есть
//! `format: "json"`, отдающий исходник без потерь.

use serde_json::Value;

use crate::plugins::theory::runtime::build_service;
use crate::plugins::theory::service::exceptions::TheoryServiceError;
use crate::server::state::AppState;

use super::{trim, ContentView, Fetch, FetchError, TrimPaths, Trimmed};

pub struct TheoryView;

impl ContentView for TheoryView {
    fn type_keys(&self) -> &'static [&'static str] {
        &["theory"]
    }

    fn label(&self) -> &'static str {
        "теория"
    }

    fn fetch<'a>(&'a self, state: &'a AppState, resource_id: &'a str) -> Fetch<'a> {
        Box::pin(async move {
            build_service(&state.pool)
                .get(resource_id)
                .await
                .map(|data| data.content)
                .map_err(|e| match e {
                    // Строгое чтение теории: отсутствие контента — это «нет
                    // содержимого», а не поломка хранилища.
                    TheoryServiceError::NotFound(_) => FetchError::NoContent,
                    other => FetchError::Read(format!("содержимое теории: {other}")),
                })
        })
    }

    fn to_text(&self, raw: &Value) -> String {
        to_text(raw)
    }

    fn trim(&self, raw: &Value, budget: usize) -> Option<Trimmed> {
        // Блоки документа независимы: обрезаем по границе блока.
        trim::trim_by_items(
            raw,
            &TrimPaths {
                items: "content",
                keyed_maps: &[],
                id: "id",
            },
            budget,
        )
    }
}

/// Основной вход: документ редактора. Формат определяется по форме, а не по
/// версии: в БД встречаются строки, записанные старым Lexical-образным
/// пустым состоянием.
pub fn to_text(raw: &Value) -> String {
    if is_editor_doc(raw) {
        return blocks(raw.get("content").and_then(Value::as_array));
    }
    if raw.get("root").is_some() {
        return legacy_blocks(
            raw.get("root")
                .and_then(|r| r.get("children"))
                .and_then(Value::as_array),
        );
    }
    raw.to_string()
}

/// Признак документа редактора — тот же, что проверяет фронт
/// (`isTipTapDoc` в `useTheoryEditor.ts`).
fn is_editor_doc(raw: &Value) -> bool {
    raw.get("type").and_then(Value::as_str) == Some("doc")
        && raw.get("content").and_then(Value::as_array).is_some()
}

/// Блочные узлы документа, по одному на элемент `content`. Блоки разделяются
/// пустой строкой — так границы видны и человеку, и модели.
fn blocks(nodes: Option<&Vec<Value>>) -> String {
    let Some(nodes) = nodes else {
        return String::new();
    };
    let chunks: Vec<String> = nodes
        .iter()
        .map(|node| block(node).trim_end().to_string())
        .filter(|chunk| !chunk.is_empty())
        .collect();

    chunks.join("\n\n")
}

/// Legacy-разбор: у Lexical-узлов нет `content`, содержимое лежит в `children`,
/// текст — в поле `text`. Нужен только для строк, записанных до перехода на
/// TipTap; перенос в текст приблизительный.
fn legacy_blocks(nodes: Option<&Vec<Value>>) -> String {
    let Some(nodes) = nodes else {
        return String::new();
    };
    let mut out = String::new();
    for node in nodes {
        let kind = node.get("type").and_then(Value::as_str).unwrap_or_default();
        match kind {
            "text" => out.push_str(node.get("text").and_then(Value::as_str).unwrap_or_default()),
            "linebreak" => out.push('\n'),
            _ => {
                if let Some(kids) = node.get("children").and_then(Value::as_array) {
                    out.push_str(&legacy_blocks(Some(kids)));
                }
                // Блочный узел закрывается переводом строки, иначе абзацы
                // слипнутся в один.
                if matches!(kind, "paragraph" | "heading" | "quote" | "listitem") {
                    out.push('\n');
                }
            }
        }
    }
    out.trim_end().to_string()
}

/// Типы блочных узлов: их содержимое — не инлайн, а вложенные блоки.
const BLOCK_TYPES: [&str; 8] = [
    "paragraph",
    "heading",
    "bulletList",
    "orderedList",
    "blockquote",
    "codeBlock",
    "callout",
    "table",
];

fn is_inline(node: &Value) -> bool {
    let kind = node.get("type").and_then(Value::as_str).unwrap_or_default();
    !BLOCK_TYPES.contains(&kind)
}

/// Дети узла: блочные разделяются пустой строкой, инлайн идёт подряд. Форма
/// детей различается сама — судить приходится по их типам.
fn children(node: &Value) -> String {
    let Some(kids) = node.get("content").and_then(Value::as_array) else {
        return String::new();
    };
    if kids.iter().all(is_inline) {
        return kids.iter().map(inline).collect();
    }
    blocks(Some(kids))
}

fn block(node: &Value) -> String {
    let kind = node.get("type").and_then(Value::as_str).unwrap_or_default();
    let inner = || children(node);

    match kind {
        "paragraph" => inner(),
        "heading" => {
            let level = node
                .get("attrs")
                .and_then(|a| a.get("level"))
                .and_then(Value::as_u64)
                .unwrap_or(1)
                .clamp(1, 6) as usize;
            let text = inner();
            if text.is_empty() {
                String::new()
            } else {
                format!("{} {text}", "#".repeat(level))
            }
        }
        "codeBlock" => {
            let language = node
                .get("attrs")
                .and_then(|a| a.get("language"))
                .and_then(Value::as_str)
                .unwrap_or_default();
            format!("```{language}\n{}\n```", inner())
        }
        "blockquote" => inner()
            .lines()
            .map(|line| format!("> {line}"))
            .collect::<Vec<_>>()
            .join("\n"),
        "bulletList" | "orderedList" => list(node, kind == "orderedList"),
        "horizontalRule" => "---".to_string(),
        // Таблицы: строки пайпами, без выравнивания по колонкам — читается и
        // дешевле, а данные остаются на месте.
        "table" => node
            .get("content")
            .and_then(Value::as_array)
            .map(|rows| {
                rows.iter()
                    .map(|row| {
                        let cells = row
                            .get("content")
                            .and_then(Value::as_array)
                            .map(|cells| cells.iter().map(children).collect::<Vec<_>>().join(" | "))
                            .unwrap_or_default();
                        format!("| {cells}")
                    })
                    .collect::<Vec<_>>()
                    .join("\n")
            })
            .unwrap_or_default(),
        "callout" => {
            let tone = node
                .get("attrs")
                .and_then(|a| a.get("tone"))
                .and_then(Value::as_str)
                .unwrap_or("info");
            format!("[выноска {tone}] {}", inner())
        }
        "formula" => format!("$$ {} $$", inner()),
        "embed" => {
            let url = node
                .get("attrs")
                .and_then(|a| a.get("url"))
                .and_then(Value::as_str)
                .unwrap_or_default();
            let caption = node
                .get("attrs")
                .and_then(|a| a.get("caption"))
                .and_then(Value::as_str)
                .unwrap_or_default();
            format!("[вставка {url}]{caption}")
        }
        "image" => {
            let src = node
                .get("attrs")
                .and_then(|a| a.get("src"))
                .and_then(Value::as_str)
                .unwrap_or_default();
            let alt = node
                .get("attrs")
                .and_then(|a| a.get("alt"))
                .and_then(Value::as_str)
                .unwrap_or_default();
            format!("![{alt}]({src})")
        }
        // Инлайн-узел на верхнем уровне (например wikiLink) — печатаем как есть.
        _ => inner(),
    }
}

fn list(node: &Value, ordered: bool) -> String {
    node.get("content")
        .and_then(Value::as_array)
        .map(|items| {
            items
                .iter()
                .enumerate()
                .map(|(index, item)| {
                    let marker = if ordered {
                        format!("{}. ", index + 1)
                    } else {
                        "- ".to_string()
                    };
                    // Вложенные списки разворачиваются в свои строки, поэтому
                    // маркер первой строки приклеиваем вручную.
                    let text = blocks(item.get("content").and_then(Value::as_array));
                    let mut lines = text.lines();
                    let first = lines.next().unwrap_or_default().trim();
                    let rest: Vec<&str> = lines.collect();
                    format!("{marker}{first}\n{}", rest.join("\n"))
                        .trim_end()
                        .to_string()
                })
                .collect::<Vec<_>>()
                .join("\n")
        })
        .unwrap_or_default()
}

/// Один инлайн-узел. Соседние текстовые узлы склеиваются без разделителя — это
/// один абзац, разбитый форматированием.
fn inline(node: &Value) -> String {
    let kind = node.get("type").and_then(Value::as_str).unwrap_or_default();
    let text = node.get("text").and_then(Value::as_str).unwrap_or_default();

    match kind {
        "hardBreak" => "\n".to_string(),
        "wikiLink" => {
            let label = node
                .get("attrs")
                .and_then(|a| a.get("label"))
                .and_then(Value::as_str)
                .unwrap_or("ссылка");
            format!("[[{label}]]")
        }
        _ => apply_marks(text, node.get("marks").and_then(Value::as_array)),
    }
}

/// Марки — от внутреннего к внешнему, иначе `**` накрывает `` ` `` и разметка
/// ломается. `underline` и `highlight` в текст не переносятся: для агента это
/// шум, а потеря видна только при обратной записи, которая идёт через `json`.
fn apply_marks(text: &str, marks: Option<&Vec<Value>>) -> String {
    let Some(marks) = marks else {
        return text.to_string();
    };
    let has = |name: &str| {
        marks
            .iter()
            .any(|m| m.get("type").and_then(Value::as_str) == Some(name))
    };

    let mut out = if has("code") {
        format!("`{text}`")
    } else {
        text.to_string()
    };
    if has("bold") {
        out = format!("**{out}**");
    }
    if has("italic") {
        out = format!("*{out}*");
    }
    if has("strike") {
        out = format!("~~{out}~~");
    }
    if has("link") {
        let href = marks
            .iter()
            .find(|m| m.get("type").and_then(Value::as_str) == Some("link"))
            .and_then(|m| m.get("attrs"))
            .and_then(|a| a.get("href"))
            .and_then(Value::as_str)
            .unwrap_or_default();
        out = format!("[{out}]({href})");
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn doc(nodes: serde_json::Value) -> Value {
        json!({"type": "doc", "content": nodes})
    }

    #[test]
    fn заголовки_списки_и_код() {
        let raw = doc(json!([
            {"type": "heading", "attrs": {"level": 2}, "content": [
                {"type": "text", "text": "Введение"}
            ]},
            {"type": "paragraph", "content": [{"type": "text", "text": "Абзац."}]},
            {"type": "bulletList", "content": [
                {"type": "listItem", "content": [{"type": "paragraph", "content": [
                    {"type": "text", "text": "первый"}
                ]}]},
                {"type": "listItem", "content": [{"type": "paragraph", "content": [
                    {"type": "text", "text": "второй"}
                ]}]}
            ]},
            {"type": "orderedList", "content": [
                {"type": "listItem", "content": [{"type": "paragraph", "content": [
                    {"type": "text", "text": "шаг"}
                ]}]}
            ]},
            {"type": "codeBlock", "attrs": {"language": "rust"}, "content": [
                {"type": "text", "text": "let x = 1;"}
            ]},
            {"type": "blockquote", "content": [{"type": "text", "text": "цитата"}]},
            {"type": "horizontalRule"}
        ]));

        assert_eq!(
            to_text(&raw),
            "## Введение\n\nАбзац.\n\n- первый\n- второй\n\n1. шаг\n\n```rust\nlet x = 1;\n```\n\n> цитата\n\n---"
        );
    }

    #[test]
    fn соседние_текстовые_узлы_склеиваются_без_пробела() {
        let raw = doc(json!([
            {"type": "paragraph", "content": [
                {"type": "text", "text": "Текст "},
                {"type": "text", "marks": [{"type": "bold"}], "text": "жирный"},
                {"type": "text", "text": " конец"}
            ]}
        ]));
        assert_eq!(to_text(&raw), "Текст **жирный** конец");
    }

    #[test]
    fn марки_вкладываются_от_внутреннего_к_внешнему() {
        let raw = doc(json!([
            {"type": "paragraph", "content": [
                {"type": "text", "marks": [{"type": "bold"}, {"type": "code"}], "text": "x"}
            ]}
        ]));
        assert_eq!(to_text(&raw), "**`x`**");
    }

    #[test]
    fn ссылки_выноски_формулы_и_вики_читаемы() {
        let raw = doc(json!([
            {"type": "paragraph", "content": [
                {"type": "text", "marks": [{"type": "link", "attrs": {"href": "https://x"}}],
                 "text": "документация"},
                {"type": "wikiLink", "attrs": {"resourceId": "r-9", "label": "Материал"}}
            ]},
            {"type": "callout", "attrs": {"tone": "warning"}, "content": [
                {"type": "paragraph", "content": [{"type": "text", "text": "Осторожно"}]}
            ]},
            {"type": "formula", "content": [{"type": "text", "text": "E = mc^2"}]},
            {"type": "embed", "attrs": {"url": "https://v", "caption": "ролик"}}
        ]));

        assert_eq!(
            to_text(&raw),
            "[документация](https://x)[[Материал]]\n\n[выноска warning] Осторожно\n\n$$ E = mc^2 $$\n\n[вставка https://v]ролик"
        );
    }

    #[test]
    fn таблица_печатается_строками() {
        let raw = doc(json!([
            {"type": "table", "content": [
                {"type": "tableRow", "content": [
                    {"type": "tableHeader", "content": [{"type": "text", "text": "Колонка"}]}
                ]},
                {"type": "tableRow", "content": [
                    {"type": "tableCell", "content": [{"type": "text", "text": "значение"}]}
                ]}
            ]}
        ]));
        assert_eq!(to_text(&raw), "| Колонка\n| значение");
    }

    #[test]
    fn legacy_лексикальное_состояние_не_даёт_пустоту() {
        let raw = json!({"root": {"children": [
            {"type": "paragraph", "children": [
                {"type": "text", "text": "Старый текст"}
            ]}
        ]}});
        assert_eq!(to_text(&raw), "Старый текст");
    }

    #[test]
    fn пустой_документ_даёт_пустой_текст() {
        assert_eq!(to_text(&doc(json!([]))), "");
    }

    #[test]
    fn неизвестная_форма_не_теряется_молча() {
        let raw = json!({"что-то": "неизвестно"});
        assert_eq!(to_text(&raw), r#"{"что-то":"неизвестно"}"#);
    }
}
