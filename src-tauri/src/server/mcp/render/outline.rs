//! Оглавление курса текстовым деревом — основной инструмент навигации агента.
//!
//! Почему текст, а не JSON: агент получает результат как текст, и одна строка
//! на узел («отступ = глубина, id в скобках, `upd:` — дата изменения») дешевле
//! вложенного JSON примерно в 10–15 раз и читается однозначно — та же форма,
//! что оглавление или вывод команды `ls`, которая сильно представлена в
//! обучении модели.
//!
//! Плоский список с `parentId` для этого не годится: на 50+ узлах модель
//! склеивает родителей ненадёжно, и структуру приходится собирать ей самой.

use std::collections::{HashMap, HashSet};

use crate::services::structure::StructureNodeFlat;

/// Глубина по умолчанию: модуль и его содержимое — типичный вопрос агента.
pub const DEFAULT_DEPTH: usize = 2;

/// Потолок узлов по умолчанию. `depth` ограничивает вложенность, но не ширину,
/// поэтому ширину стережёт отдельный счётчик.
pub const DEFAULT_MAX_NODES: usize = 200;

/// Предохранитель для обхода вверх по `parentId` при битых данных (цикл).
const MAX_CHAIN: usize = 64;

pub struct OutlineOpts {
    /// Узел, с которого строить. `None` — корень курса. Директория — её
    /// поддерево, ресурс — путь от корня до него.
    pub root_id: Option<String>,
    pub depth: usize,
    /// Типы ресурсов для показа; директории проходят всегда (через них путь).
    pub type_keys: Vec<String>,
    pub max_nodes: usize,
}

impl Default for OutlineOpts {
    fn default() -> Self {
        Self {
            root_id: None,
            depth: DEFAULT_DEPTH,
            type_keys: Vec::new(),
            max_nodes: DEFAULT_MAX_NODES,
        }
    }
}

/// Дерево вместе со счётчиками — шапку ответа собирает вызывающий.
pub struct Outline {
    pub text: String,
    /// Узлов в выборке всего.
    pub total: usize,
    /// Узлов выведено.
    pub shown: usize,
    /// Ресурсов (без директорий) в выборке.
    pub resources: usize,
    pub truncated: bool,
}

pub fn build(nodes: &[StructureNodeFlat], opts: &OutlineOpts) -> Outline {
    let view = select(nodes, opts);
    let ids: HashSet<&str> = view.iter().map(|n| n.id.as_str()).collect();
    let mut children: HashMap<&str, Vec<&StructureNodeFlat>> = HashMap::new();
    let mut top: Vec<&StructureNodeFlat> = Vec::new();

    for node in &view {
        match node.parent_id.as_deref() {
            Some(parent) if ids.contains(parent) => {
                children.entry(parent).or_default().push(node);
            }
            // Нет родителя в выборке: верхний уровень либо сирота из-за битых
            // данных. Сироту терять нельзя — иначе материал пропадёт из оглавления.
            _ => top.push(node),
        }
    }
    for siblings in children.values_mut() {
        siblings.sort_by_key(|n| n.position);
    }
    top.sort_by_key(|n| n.position);

    let mut text = String::new();
    let mut shown = 0usize;
    let mut truncated = false;

    match resolve_root(&view, opts.root_id.as_deref()) {
        Root::None => {
            let mut budget = opts.max_nodes;
            for node in &top {
                shown += write_node(node, 0, opts, &children, &mut budget, &mut text);
            }
            truncated = finish(&mut text, &mut budget);
        }
        // Ресурс: печатаем только путь до него, не раскрывая соседей по дороге.
        Root::Chain(chain) => {
            for (level, node) in chain.iter().enumerate() {
                write_line(node, level, &mut text);
            }
            shown = chain.len();
        }
        // Директория: её поддерево.
        Root::Subtree(node) => {
            let mut budget = opts.max_nodes;
            shown = write_node(node, 0, opts, &children, &mut budget, &mut text);
            truncated = finish(&mut text, &mut budget);
        }
    }

    Outline {
        text,
        total: view.len(),
        shown,
        resources: view.iter().filter(|n| !n.is_directory).count(),
        truncated,
    }
}

/// Слово-маркер усечения в теле дерева: по нему тесты проверяют, что вместо
/// молчаливого обрезания агент получает объяснение.
pub const TRUNCATED_MARK: &str = "усечено";

/// Есть ли узел с таким id — валидация `rootId` до сборки дерева.
pub fn contains(nodes: &[StructureNodeFlat], id: &str) -> bool {
    nodes.iter().any(|n| n.id == id)
}

enum Root<'a> {
    None,
    Subtree(&'a StructureNodeFlat),
    Chain(Vec<&'a StructureNodeFlat>),
}

fn resolve_root<'a>(view: &[&'a StructureNodeFlat], root_id: Option<&str>) -> Root<'a> {
    let Some(id) = root_id else {
        return Root::None;
    };
    let Some(node) = view.iter().find(|n| n.id == id) else {
        return Root::None;
    };
    if node.is_directory {
        return Root::Subtree(node);
    }

    // Путь от корня до ресурса: поднимаемся по parentId и разворачиваем.
    let by_id: HashMap<&str, &StructureNodeFlat> =
        view.iter().map(|n| (n.id.as_str(), *n)).collect();
    let mut chain = vec![*node];
    let mut current = *node;
    while let Some(parent) = current.parent_id.as_deref() {
        match by_id.get(parent) {
            Some(found) => {
                chain.push(*found);
                current = *found;
            }
            None => break,
        }
        if chain.len() >= MAX_CHAIN {
            break;
        }
    }
    chain.reverse();
    Root::Chain(chain)
}

/// Отбор по типам ресурсов. Директории остаются всегда: через них проходит путь.
fn select<'a>(nodes: &'a [StructureNodeFlat], opts: &OutlineOpts) -> Vec<&'a StructureNodeFlat> {
    if opts.type_keys.is_empty() {
        return nodes.iter().collect();
    }
    nodes
        .iter()
        .filter(|n| {
            n.is_directory
                || n.resource
                    .as_ref()
                    .and_then(|r| r.type_key.as_deref())
                    .is_some_and(|key| opts.type_keys.iter().any(|want| want == key))
        })
        .collect()
}

/// Обход с бюджетом узлов. Возвращает, сколько узлов выведено.
fn write_node(
    node: &StructureNodeFlat,
    level: usize,
    opts: &OutlineOpts,
    children: &HashMap<&str, Vec<&StructureNodeFlat>>,
    budget: &mut usize,
    out: &mut String,
) -> usize {
    if *budget == 0 {
        return 0;
    }
    *budget -= 1;
    write_line(node, level, out);

    if level + 1 >= opts.depth {
        return 1;
    }
    let mut shown = 1;
    if let Some(kids) = children.get(node.id.as_str()) {
        for kid in kids {
            shown += write_node(kid, level + 1, opts, children, budget, out);
        }
    }
    shown
}

/// Одна строка узла: отступ, имя, вид и идентификатор для следующего вызова.
/// Только ASCII: `📁` стоит несколько токенов на каждом узле.
fn write_line(node: &StructureNodeFlat, level: usize, out: &mut String) {
    out.push_str(&"  ".repeat(level));
    out.push_str(&node.name);

    if node.is_directory {
        out.push_str(&format!(" [dir {}]", node.id));
        out.push('\n');
        return;
    }

    out.push_str(&format!(" [res {}", node.id));
    if let Some(resource) = node.resource.as_ref() {
        if let Some(key) = resource.type_key.as_deref() {
            out.push(' ');
            out.push_str(key);
        }
        out.push_str(&format!(" upd:{}", resource.updated_at));
    }
    out.push_str("]\n");
}

/// Хвост при исчерпанном бюджете узлов: вместо молчаливого обрезания агент
/// получает объяснение и три рычага, которыми можно сузить выборку.
fn finish(out: &mut String, budget: &mut usize) -> bool {
    if *budget > 0 {
        return false;
    }
    out.push_str(&format!(
        "  … {TRUNCATED_MARK} по maxNodes: сузь выборку — rootId, depth или typeKeys\n"
    ));
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::services::resource::ResourceData;

    fn resource(
        id: &str,
        parent: Option<&str>,
        position: i64,
        name: &str,
        key: &str,
    ) -> StructureNodeFlat {
        StructureNodeFlat {
            id: id.into(),
            course_id: "c-1".into(),
            parent_id: parent.map(Into::into),
            position,
            is_directory: false,
            resource: Some(ResourceData {
                id: id.into(),
                course_id: "c-1".into(),
                type_key: Some(key.into()),
                name: name.into(),
                metadata: serde_json::json!({}),
                files: vec![],
                created_at: 0,
                updated_at: 1700,
            }),
            directory_id: None,
            name: name.into(),
        }
    }

    fn directory(id: &str, parent: Option<&str>, position: i64, name: &str) -> StructureNodeFlat {
        StructureNodeFlat {
            id: id.into(),
            course_id: "c-1".into(),
            parent_id: parent.map(Into::into),
            position,
            is_directory: true,
            resource: None,
            directory_id: Some(id.into()),
            name: name.into(),
        }
    }

    /// Модуль с двумя лекциями и задачей, плюс второй модуль.
    fn tree() -> Vec<StructureNodeFlat> {
        vec![
            directory("d2", None, 2, "Модуль 2"),
            resource("r2", Some("d1"), 2, "Задачи", "task"),
            directory("d1", None, 1, "Модуль 1"),
            resource("r1", Some("d1"), 1, "Лекция 1", "theory"),
        ]
    }

    #[test]
    fn дерево_с_отступами_и_сортировкой_по_position() {
        let out = build(&tree(), &OutlineOpts::default());
        assert_eq!(
            out.text,
            "Модуль 1 [dir d1]\n  Лекция 1 [res r1 theory upd:1700]\n  Задачи [res r2 task upd:1700]\nМодуль 2 [dir d2]\n"
        );
        assert_eq!(out.total, 4);
        assert_eq!(out.shown, 4);
        assert_eq!(out.resources, 2);
        assert!(!out.truncated);
    }

    #[test]
    fn depth_режет_вложенность_но_не_ширину() {
        let opts = OutlineOpts {
            depth: 1,
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert_eq!(out.text, "Модуль 1 [dir d1]\nМодуль 2 [dir d2]\n");
    }

    #[test]
    fn max_nodes_даёт_усечение_с_подсказкой() {
        let opts = OutlineOpts {
            max_nodes: 3,
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert!(out.truncated);
        assert!(out.text.contains(TRUNCATED_MARK));
        assert!(out.shown <= 3);
    }

    #[test]
    fn root_id_на_директорию_даёт_поддерево() {
        let opts = OutlineOpts {
            root_id: Some("d1".into()),
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert_eq!(
            out.text,
            "Модуль 1 [dir d1]\n  Лекция 1 [res r1 theory upd:1700]\n  Задачи [res r2 task upd:1700]\n"
        );
    }

    #[test]
    fn root_id_на_ресурс_даёт_путь_без_соседей() {
        let opts = OutlineOpts {
            root_id: Some("r2".into()),
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert_eq!(
            out.text,
            "Модуль 1 [dir d1]\n  Задачи [res r2 task upd:1700]\n"
        );
    }

    #[test]
    fn неизвестный_root_id_не_молчит_а_показывает_корень() {
        let opts = OutlineOpts {
            root_id: Some("нет-такого".into()),
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert!(out.text.starts_with("Модуль 1"));
    }

    #[test]
    fn сирота_не_теряется_из_оглавления() {
        let mut nodes = tree();
        nodes.push(resource("r3", Some("d-нет"), 9, "Потеряшка", "theory"));
        let out = build(&nodes, &OutlineOpts::default());
        assert!(out.text.contains("Потеряшка"));
    }

    #[test]
    fn type_keys_фильтрует_ресурсы_но_держит_директории() {
        let opts = OutlineOpts {
            type_keys: vec!["theory".into()],
            ..Default::default()
        };
        let out = build(&tree(), &opts);
        assert!(out.text.contains("Модуль 1 [dir d1]"));
        assert!(out.text.contains("Лекция 1"));
        assert!(!out.text.contains("Задачи"));
        assert_eq!(out.resources, 1);
    }

    #[test]
    fn цикл_в_родителях_не_вешает_обход() {
        let mut nodes = tree();
        // d1 объявляет родителем d2, а d2 — родителем d1.
        nodes[3].parent_id = Some("d2".into());
        let opts = OutlineOpts {
            root_id: Some("r1".into()),
            ..Default::default()
        };
        let out = build(&nodes, &opts);
        assert!(out.text.contains("Лекция 1"));
        assert!(out.text.lines().count() <= MAX_CHAIN);
    }

    #[test]
    fn contains_ищет_узел_по_id() {
        let nodes = tree();
        assert!(contains(&nodes, "r1"));
        assert!(!contains(&nodes, "r404"));
    }
}
