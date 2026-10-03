//! `mai_get_content` — содержимое ресурса, маршрутизация по `typeKey`.
//!
//! Инструмент не знает, где лежит контент: тип ресурса выбирает проекцию из
//! `content/registry.rs`, и добавление нового типа не трогает этот файл.
//!
//! Два формата по назначению, а не по вкусу: `text` — чтобы понять содержимое
//! дёшево, `json` — чтобы работать с документом без потерь. Текстовая проекция
//! теории безвозвратна (выноски, формулы, вставки в текст не ложатся), поэтому
//! она никогда не единственная.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::server::state::AppState;
use crate::services::resource::ResourceService;

use super::super::content;
use super::super::render;
use super::args::ResourceIdArgs;

pub const NAME: &str = "mai_get_content";

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct Args {
    #[serde(flatten)]
    pub resource: ResourceIdArgs,
    /// Формат ответа. `text` (по умолчанию) — читаемый текст, самый дешёвый
    /// вариант; `json` — исходный документ без потерь, когда нужна структура.
    #[serde(default)]
    pub format: Format,
}

#[derive(Deserialize, JsonSchema, Default)]
#[serde(rename_all = "lowercase")]
pub enum Format {
    #[default]
    Text,
    Json,
}

/// Конверт формата `json`: сам документ плюс привязка к ресурсу, чтобы ответ
/// был самодостаточным и его можно было отдать в запись без потери контекста.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Envelope<'a> {
    resource_id: &'a str,
    name: &'a str,
    type_key: &'a str,
    /// Миллисекунды эпохи: агент видит свежесть прочитанного.
    updated_at: i64,
    content: &'a Value,
    /// Заполняется, когда документ не влез в лимит ответа и был урезан по
    /// границе элемента: сколько блоков/задач/шагов отдали и сколько их всего.
    #[serde(skip_serializing_if = "Option::is_none")]
    truncated: Option<Truncation>,
}

/// Признак структурной обрезки содержимого.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Truncation {
    shown: usize,
    total: usize,
    hint: &'static str,
}

/// Бюджет обрезки: кап ответа минус запас на конверт и маркер обрезки.
const JSON_TRIM_BUDGET: usize = render::MAX_RESULT_CHARS - 2_000;

pub async fn run(state: &AppState, args: Args) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let rt_repo = Arc::new(SqliteResourceTypeRepository::new(state.pool.clone()));
    let service = ResourceService::new(
        state.app_paths.clone(),
        repo,
        rt_repo,
        state.publisher.clone(),
    );

    let resource = match service.get(&args.resource.resource_id).await {
        Ok(resource) => resource,
        Err(e) => return render::tool_error(NAME, e),
    };

    let Some(type_key) = resource.type_key.as_deref() else {
        return render::tool_error(
            NAME,
            format!(
                "у ресурса {} нет типа — содержимого у него не бывает",
                resource.id
            ),
        );
    };
    let Some(view) = content::find(type_key) else {
        let known = content::known_type_keys().join(", ");
        return render::tool_error(
            NAME,
            format!("содержимое типа {type_key} наружу не выставлено; известны: {known}"),
        );
    };

    let raw = match view.fetch(state, &resource.id).await {
        Ok(raw) => raw,
        Err(e) => {
            return render::tool_error(
                NAME,
                format!("у ресурса {} ({}) {}", resource.id, view.label(), e),
            )
        }
    };

    match args.format {
        Format::Text => {
            let head = format!(
                "«{}» [{} {}] upd:{} · формат text\n\n",
                resource.name, type_key, resource.id, resource.updated_at
            );
            let body = view.to_text(&raw);
            if body.trim().is_empty() {
                return render::tool_error(
                    NAME,
                    format!(
                        "у ресурса {} ({}) нет сохранённого содержимого",
                        resource.id,
                        view.label()
                    ),
                );
            }
            Ok(render::text(NAME, format!("{head}{body}")))
        }
        Format::Json => {
            // Документ не влезает в лимит ответа — режем структурно, по границе
            // элемента, чтобы агент получил валидный JSON (см. `ContentView::trim`).
            let trimmed = view.trim(&raw, JSON_TRIM_BUDGET);
            let (content, truncation) = match &trimmed {
                Some(t) => (
                    t.value.clone(),
                    Some(Truncation {
                        shown: t.shown,
                        total: t.total,
                        hint: "содержимое урезано по границе элемента; остальное — mai_search по нужной фразе",
                    }),
                ),
                None => (raw.clone(), None),
            };

            render::json(
                NAME,
                &Envelope {
                    resource_id: &resource.id,
                    name: &resource.name,
                    type_key,
                    updated_at: resource.updated_at,
                    content: &content,
                    truncated: truncation,
                },
            )
        }
    }
}
