//! Реестр проекций содержимого: `typeKey` → `ContentView`.
//!
//! Зеркалит `plugins/gateway/registry.rs`: одно место перечисления типов в
//! ядре. Новый тип ресурса — реализация `ContentView` и одна строка в `all()`.

use super::{ContentView, SnapshotView, TheoryView};

/// Статические проекции. Отдаём &'static — набор не меняется в рантайме.
pub fn all() -> Vec<&'static dyn ContentView> {
    vec![&THEORY, &TASK, &CODE]
}

/// Проекция по `typeKey`. `None` — тип неизвестен ядру: содержимое внешнего
/// плагина наружу не выставлено.
pub fn find(type_key: &str) -> Option<&'static dyn ContentView> {
    all()
        .into_iter()
        .find(|view| view.type_keys().contains(&type_key))
}

static THEORY: TheoryView = TheoryView;
static TASK: SnapshotView = SnapshotView {
    type_keys: &["task"],
    label: "задачи",
    fetch: super::snapshot::fetch_task,
};
static CODE: SnapshotView = SnapshotView {
    type_keys: &["code"],
    label: "код",
    fetch: super::snapshot::fetch_code,
};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn известные_типы_не_дублируются() {
        let mut keys = super::super::known_type_keys();
        let before = keys.len();
        keys.sort_unstable();
        keys.dedup();
        assert_eq!(keys.len(), before, "typeKey задвоен в реестре");
        assert_eq!(keys, vec!["code", "task", "theory"]);
    }

    #[test]
    fn поиск_по_типу_и_провал_на_неизвестном() {
        assert_eq!(find("theory").unwrap().label(), "теория");
        assert_eq!(find("task").unwrap().label(), "задачи");
        assert!(find("что-то-от-плагина").is_none());
    }
}
