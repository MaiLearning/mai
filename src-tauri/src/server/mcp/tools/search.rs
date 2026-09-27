//! `mai_search` — поиск по именам узлов и содержимому ресурсов.
//!
//! Нужен, чтобы агенту не приходилось читать содержимое целиком ради одного
//! факта. Отдаёт совпадения с `resourceId` и выдержкой вокруг них, а не тело
//! ресурса.
//!
//! Цена честная: содержимое лежит в отдельной таблице на каждый тип, поэтому
//! поиск читает хранилище каждого ресурса выборки. Отсюда `maxScan` — потолок
//! просмотренных ресурсов; исчерпание видно в ответе, молчаливого усечения нет.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::database::sqlite::repositories::directory::SqliteDirectoryRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::structure::SqliteStructureRepository;
use crate::server::state::AppState;
use crate::services::course::CourseService;
use crate::services::structure::{StructureNodeFlat, StructureService};

use super::super::content;
use super::super::render;

/// Сколько символов контекста показывать с каждой стороны вхождения.
const EXCERPT_RADIUS: usize = 60;

/// Сколько совпадений считать до пометки «и ещё есть».
const COUNT_CAP: usize = 99;

/// Сколько ресурсов просматривать по умолчанию.
const DEFAULT_MAX_SCAN: usize = 200;

/// Сколько совпадений отдавать по умолчанию.
const DEFAULT_MAX_RESULTS: usize = 20;

pub const NAME: &str = "mai_search";

#[derive(Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
pub struct Args {
    /// Что искать. Сравнение без учёта регистра, по подстроке.
    pub query: String,
    /// Ограничить поиск одним курсом. Не задан — по всем курсам.
    #[serde(default)]
    pub course_id: Option<String>,
    /// Ограничить типы ресурсов (theory, task, code).
    #[serde(default)]
    pub type_keys: Option<Vec<String>>,
    /// Сколько совпадений вернуть. По умолчанию 20.
    #[serde(default)]
    pub max_results: Option<usize>,
    /// Сколько ресурсов просмотреть. По умолчанию 200; при исчерпании в ответе
    /// стоит пометка, и поиск можно сузить courseId или typeKeys.
    #[serde(default)]
    pub max_scan: Option<usize>,
}

/// Одно совпадение: где нашлось и что вокруг.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Hit {
    resource_id: String,
    course_id: String,
    name: String,
    type_key: Option<String>,
    /// `name` — в имени узла, `content` — в содержимом.
    place: &'static str,
    /// Номер строки в содержимом, для `name` всегда 0.
    line: usize,
    /// Всего вхождений; `COUNT_CAP + 1` означает «больше, чем посчитано».
    count: usize,
    excerpt: String,
}

pub async fn run(state: &AppState, args: Args) -> Result<CallToolResult, ErrorData> {
    if args.query.trim().is_empty() {
        return render::tool_error(NAME, "query пустой — нечего искать");
    }

    let courses = match course_ids(state, args.course_id.as_deref()).await {
        Ok(courses) => courses,
        Err(e) => return render::tool_error(NAME, e),
    };
    let max_results = args.max_results.unwrap_or(DEFAULT_MAX_RESULTS).max(1);
    let max_scan = args.max_scan.unwrap_or(DEFAULT_MAX_SCAN);

    let mut hits: Vec<Hit> = Vec::new();
    let mut scanned = 0usize;
    let mut scan_capped = false;
    let mut failed: Vec<String> = Vec::new();

    for course_id in &courses {
        let nodes = match structure(state).get_structure(course_id).await {
            Ok(nodes) => nodes,
            Err(e) => return render::tool_error(NAME, e),
        };
        for node in nodes.iter().filter(|n| !n.is_directory) {
            if scanned >= max_scan {
                scan_capped = true;
                break;
            }
            if !wanted(node, args.type_keys.as_deref()) {
                continue;
            }
            scanned += 1;

            let name_hit = locate(&node.name, &args.query);
            if let Some((count, line, excerpt)) = name_hit {
                hits.push(hit(node, "name", count, line, excerpt));
            }

            let Some(type_key) = node.resource.as_ref().and_then(|r| r.type_key.as_deref()) else {
                continue;
            };
            let Some(view) = content::find(type_key) else {
                continue;
            };
            match view.fetch(state, &node.id).await {
                Ok(raw) => {
                    if let Some((count, line, excerpt)) = locate(&view.to_text(&raw), &args.query) {
                        hits.push(hit(node, "content", count, line, excerpt));
                    }
                }
                // Ресурс без содержимого — норма, не повод прерывать поиск.
                Err(e) => failed.push(format!("{}: {e}", node.id)),
            }
        }
        if scan_capped {
            break;
        }
    }

    // Сначала попадания в имя: выбор узла дешевле чтения содержимого.
    hits.sort_by_key(|h| u8::from(h.place != "name"));
    let total = hits.len();
    hits.truncate(max_results);

    let mut report = format!(
        "запрос «{}» · курсов {} · просмотрено ресурсов {}{}",
        args.query,
        courses.len(),
        scanned,
        if scan_capped {
            " (потолок maxScan)"
        } else {
            ""
        }
    );
    if hits.is_empty() {
        report.push_str("\nсовпадений нет");
    } else if total > hits.len() {
        report.push_str(&format!("\nпоказано {} из {}", hits.len(), total));
    }
    if !failed.is_empty() {
        report.push_str(&format!("\nбез содержимого: {}", failed.join(", ")));
    }

    let body = render::json_string(&hits)?;

    Ok(render::text(NAME, format!("{report}\n{body}")))
}

fn hit(
    node: &StructureNodeFlat,
    place: &'static str,
    count: usize,
    line: usize,
    excerpt: String,
) -> Hit {
    Hit {
        resource_id: node.id.clone(),
        course_id: node.course_id.clone(),
        name: node.name.clone(),
        type_key: node.resource.as_ref().and_then(|r| r.type_key.clone()),
        place,
        line,
        count,
        excerpt,
    }
}

async fn course_ids(state: &AppState, only: Option<&str>) -> Result<Vec<String>, String> {
    if let Some(id) = only {
        return Ok(vec![id.to_string()]);
    }
    let repo = Arc::new(SqliteCourseRepository::new(state.pool.clone()));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());
    let courses = service.all().await.map_err(|e| e.to_string())?;

    Ok(courses.into_iter().map(|c| c.id).collect())
}

fn structure(state: &AppState) -> StructureService {
    let repo = Arc::new(SqliteStructureRepository::new(state.pool.clone()));
    let dir_repo = Arc::new(SqliteDirectoryRepository::new(state.pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(state.pool.clone()));

    StructureService::new(repo, dir_repo, resource_repo, state.publisher.clone())
}

fn wanted(node: &StructureNodeFlat, type_keys: Option<&[String]>) -> bool {
    let Some(wanted) = type_keys else {
        return true;
    };
    if wanted.is_empty() {
        return true;
    }
    node.resource
        .as_ref()
        .and_then(|r| r.type_key.as_deref())
        .is_some_and(|key| wanted.iter().any(|w| w == key))
}

/// Первое вхождение: (всего вхождений, номер строки, выдержка).
fn locate(haystack: &str, needle: &str) -> Option<(usize, usize, String)> {
    let chars: Vec<char> = haystack.chars().collect();
    let pattern: Vec<char> = needle.to_lowercase().chars().collect();
    if pattern.is_empty() || pattern.len() > chars.len() {
        return None;
    }

    let mut count = 0usize;
    let mut first = None;
    for start in 0..=chars.len() - pattern.len() {
        let matched = pattern
            .iter()
            .enumerate()
            .all(|(offset, want)| char_eq_ci(chars[start + offset], *want));
        if !matched {
            continue;
        }
        if first.is_none() {
            first = Some(start);
        }
        count += 1;
        if count > COUNT_CAP {
            break;
        }
    }
    let first = first?;

    let line = chars[..first].iter().filter(|c| **c == '\n').count() + 1;
    let from = first.saturating_sub(EXCERPT_RADIUS);
    let to = (first + pattern.len() + EXCERPT_RADIUS).min(chars.len());
    let mut excerpt: String = chars[from..to].iter().collect();
    excerpt = excerpt.split_whitespace().collect::<Vec<_>>().join(" ");
    if from > 0 {
        excerpt.insert_str(0, "… ");
    }
    if to < chars.len() {
        excerpt.push_str(" …");
    }

    Some((count, line, excerpt))
}

/// Равенство без учёта регистра; регистр сравнивается посимвольно, чтобы не
/// раздувать копию документа.
fn char_eq_ci(a: char, b: char) -> bool {
    a == b || a.to_lowercase().eq(std::iter::once(b))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn находит_вхождение_с_номером_строки_и_выдержкой() {
        let text = "первая строка\nвторая строка про Rust\nтретья";
        let (count, line, excerpt) = locate(text, "rust").unwrap();
        assert_eq!((count, line), (1, 2));
        assert!(excerpt.contains("про Rust"));
    }

    #[test]
    fn регистр_не_важен() {
        assert!(locate("Hello World", "hello").is_some());
        assert!(locate("Hello World", "HELLO").is_some());
    }

    #[test]
    fn считает_несколько_вхождений() {
        let (count, _, _) = locate("a a a", "a").unwrap();
        assert_eq!(count, 3);
    }

    #[test]
    fn выдержка_обрезается_и_помечается_многоточиями() {
        let text = format!("{} маркер {}", "я".repeat(300), "я".repeat(300));
        let (_, _, excerpt) = locate(&text, "маркер").unwrap();
        assert!(excerpt.starts_with("… "), "{excerpt}");
        assert!(excerpt.ends_with(" …"), "{excerpt}");
        assert!(excerpt.contains("маркер"));
    }

    #[test]
    fn пустой_запрос_и_отсутствие_совпадений() {
        assert!(locate("текст", "").is_none());
        assert!(locate("текст", "zzz").is_none());
        assert!(locate("ab", "абв").is_none());
    }
}
