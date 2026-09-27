//! `mai_course_outline` — оглавление курса текстовым деревом.
//!
//! Навигационная точка входа: отдаёт `resourceId` всех материалов курса разом,
//! но по одной строке на узел. Заменяет прежний `get_course_structure`, который
//! отдавал плоский список с вложенным в каждый узел полным ресурсом.
//!
//! Сервис не меняется: `StructureService::get_structure` уже отдаёт плоский
//! список, сборка дерева — presentation.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;
use schemars::JsonSchema;
use serde::Deserialize;

use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::structure::StructureService;

use super::super::render;
use super::super::render::outline::{self, OutlineOpts};
use super::args::CourseIdArgs;

pub const NAME: &str = "mai_course_outline";

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct Args {
    #[serde(flatten)]
    pub course: CourseIdArgs,
    /// Узел, с которого строить оглавление. Не задан — корень курса. Директория —
    /// её поддерево, ресурс — путь от корня до этого узла.
    #[serde(default)]
    pub root_id: Option<String>,
    /// Глубина вложенности. По умолчанию 2: модуль и его содержимое.
    #[serde(default)]
    pub depth: Option<usize>,
    /// Показать только эти типы ресурсов (theory, task, code). Директории
    /// остаются всегда: через них проходит путь.
    #[serde(default)]
    pub type_keys: Option<Vec<String>>,
    /// Потолок числа узлов. По умолчанию 200: `depth` ограничивает вложенность,
    /// но не ширину, поэтому ширину стережёт отдельный счётчик.
    #[serde(default)]
    pub max_nodes: Option<usize>,
}

pub async fn run(state: &AppState, args: Args) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqliteStructureRepository::new(state.pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(state.pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));
    let service = StructureService::new(repo, dir_repo, resource_repo, state.publisher.clone());

    let nodes = match service.get_structure(&args.course.course_id).await {
        Ok(nodes) => nodes,
        Err(e) => return render::tool_error(NAME, e),
    };

    if let Some(root) = args.root_id.as_deref() {
        if !outline::contains(&nodes, root) {
            return render::tool_error(
                NAME,
                format!("в структуре курса нет узла {root}; посмотри оглавление целиком"),
            );
        }
    }

    let opts = OutlineOpts {
        root_id: args.root_id,
        depth: args.depth.unwrap_or(outline::DEFAULT_DEPTH),
        type_keys: args.type_keys.unwrap_or_default(),
        max_nodes: args.max_nodes.unwrap_or(outline::DEFAULT_MAX_NODES),
    };
    let out = outline::build(&nodes, &opts);

    Ok(render::text(NAME, format!("{}{}", header(&out), out.text)))
}

/// Шапка: счётчики и напоминание, что оглавление ограничено намеренно.
fn header(out: &outline::Outline) -> String {
    let scope = if out.truncated {
        format!("показано {} из {}", out.shown, out.total)
    } else {
        format!("узлов {}", out.total)
    };
    format!("{scope} · ресурсов {}\n", out.resources)
}
