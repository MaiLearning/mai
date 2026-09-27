//! Реестр MCP-ресурсов Mai: статические справочные документы под `mai://guide/`.
//!
//! Ресурс — примитив «прочитать по URI», в отличие от инструмента («сделать
//! вызов»). Справочная документация — это данные, а не действие, поэтому она
//! здесь, а не в `tools/`.
//!
//! Каталог узкий: `list_resources` отдаёт несколько записей, но каждый вызов
//! стоит агенту контекста, поэтому длинные тексты лежат по URI и читаются
//! только по необходимости.

use rmcp::model::{ErrorData, Resource};

/// Описание одного MCP-ресурса Mai.
#[derive(Debug)]
pub struct ResourceDef {
    /// URI в виде `mai://guide/<имя>`.
    pub uri: &'static str,
    /// Короткое имя для клиента.
    pub name: &'static str,
    /// Что внутри — попадает в каталог ресурсов агента.
    pub description: &'static str,
    /// Тело документа (встраивается на этапе сборки).
    pub body: &'static str,
}

impl ResourceDef {
    /// Wire-представление для `resources/list`.
    pub fn to_resource(&self) -> Resource {
        Resource::new(self.uri, self.name)
            .with_description(self.description.to_string())
            .with_mime_type("text/markdown")
    }
}

/// URI глоссария: термины платформы и соответствие типов ресурсов плагинам.
pub const GLOSSARY_URI: &str = "mai://guide/glossary";
/// URI воркфлоу: разобранные сценарии работы агента.
pub const WORKFLOW_URI: &str = "mai://guide/workflow";

/// Все статические ресурсы сервера.
pub fn all() -> Vec<ResourceDef> {
    vec![
        ResourceDef {
            uri: GLOSSARY_URI,
            name: "Глоссарий Mai",
            description: "Термины платформы (курс, ресурс, тип ресурса, узел структуры, \
                          директория, связь) и соответствие typeKey плагинам-владельцам.",
            body: include_str!("md/glossary.md"),
        },
        ResourceDef {
            uri: WORKFLOW_URI,
            name: "Воркфлоу агента",
            description: "Разобранные сценарии: найти материал, прочитать содержимое, \
                          искать место в тексте.",
            body: include_str!("md/workflow.md"),
        },
    ]
}

/// Поиск ресурса по URI.
pub fn find(uri: &str) -> Result<ResourceDef, ErrorData> {
    all().into_iter().find(|def| def.uri == uri).ok_or_else(|| {
        let available: Vec<&str> = all().iter().map(|def| def.uri).collect();
        ErrorData::resource_not_found(
            format!(
                "нет MCP-ресурса «{uri}»; доступны: {}",
                available.join(", ")
            ),
            None,
        )
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn uri_уникальны() {
        let uris: HashSet<&str> = all().iter().map(|def| def.uri).collect();
        assert_eq!(uris.len(), all().len());
    }

    #[test]
    fn тела_не_пусты_и_под_своим_заголовком() {
        for def in all() {
            assert!(!def.body.trim().is_empty(), "{} пуст", def.uri);
            assert!(
                def.body.starts_with("# "),
                "{} начинается не с заголовка",
                def.uri
            );
        }
    }

    #[test]
    fn поиск_отдаёт_описание_и_ошибку_со_списком() {
        assert_eq!(find(GLOSSARY_URI).unwrap().name, "Глоссарий Mai");

        let err = find("mai://guide/nope").unwrap_err();
        let text = err.to_string();
        assert!(text.contains("nope"));
        assert!(
            text.contains(GLOSSARY_URI),
            "нет подсказки со списком: {text}"
        );
    }
}
