use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

/// Ответ пользователя на задачу: тег `kind` + поля варианта (camelCase на проводе).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all_fields = "camelCase")]
pub enum TaskAnswerData {
    SingleChoice { choice_id: Option<String> },
    MultipleChoice { choice_ids: Vec<String> },
    TrueFalse { value: Option<bool> },
    Matching { mapping: BTreeMap<String, String> },
    Ordering { item_ids: Vec<String> },
    FillInBlank { values: BTreeMap<String, String> },
    OpenAnswer { text: String },
}

impl TaskAnswerData {
    /// Имя вида ответа для тега `kind` / колонки `kind` в БД.
    pub fn kind_name(&self) -> &'static str {
        match self {
            Self::SingleChoice { .. } => "SingleChoice",
            Self::MultipleChoice { .. } => "MultipleChoice",
            Self::TrueFalse { .. } => "TrueFalse",
            Self::Matching { .. } => "Matching",
            Self::Ordering { .. } => "Ordering",
            Self::FillInBlank { .. } => "FillInBlank",
            Self::OpenAnswer { .. } => "OpenAnswer",
        }
    }
}

/// Скалярные колонки ответа в task_progress / task_attempts.
#[derive(Debug, Default, Clone, PartialEq)]
pub struct AnswerScalars {
    pub choice_id: Option<String>,
    pub value_bool: Option<bool>,
    pub text: Option<String>,
}

/// Дочерние строки ответа; семейство таблиц (progress/attempt) выбирает repo.
#[derive(Debug, Clone, PartialEq)]
pub enum AnswerChildren {
    /// `(choice_id, позиция)`
    Choices(Vec<(String, i64)>),
    /// `(левый id, правый id)`
    Matches(Vec<(String, String)>),
    /// `(item_id, позиция)`
    Items(Vec<(String, i64)>),
    /// `(segment_id, значение)`
    Blanks(Vec<(String, String)>),
}

impl TaskAnswerData {
    /// Скаляры ответа для строк task_progress / task_attempts.
    pub fn scalars(&self) -> AnswerScalars {
        match self {
            Self::SingleChoice { choice_id } => AnswerScalars {
                choice_id: choice_id.clone(),
                ..Default::default()
            },
            Self::TrueFalse { value } => AnswerScalars {
                value_bool: *value,
                ..Default::default()
            },
            Self::OpenAnswer { text } => AnswerScalars {
                text: Some(text.clone()),
                ..Default::default()
            },
            _ => AnswerScalars::default(),
        }
    }

    /// Дочерние строки ответа; None — у вида ответа нет коллекций.
    pub fn children(&self) -> Option<AnswerChildren> {
        match self {
            Self::MultipleChoice { choice_ids } => Some(AnswerChildren::Choices(
                choice_ids
                    .iter()
                    .enumerate()
                    .map(|(i, id)| (id.clone(), i as i64))
                    .collect(),
            )),
            Self::Matching { mapping } => Some(AnswerChildren::Matches(
                mapping
                    .iter()
                    .map(|(l, r)| (l.clone(), r.clone()))
                    .collect(),
            )),
            Self::Ordering { item_ids } => Some(AnswerChildren::Items(
                item_ids
                    .iter()
                    .enumerate()
                    .map(|(i, id)| (id.clone(), i as i64))
                    .collect(),
            )),
            Self::FillInBlank { values } => Some(AnswerChildren::Blanks(
                values.iter().map(|(s, v)| (s.clone(), v.clone())).collect(),
            )),
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn answer_uses_flat_contract_json() {
        let answer = TaskAnswerData::SingleChoice {
            choice_id: Some("a".into()),
        };
        assert_eq!(
            serde_json::to_value(&answer).unwrap(),
            json!({ "kind": "SingleChoice", "choiceId": "a" })
        );

        let answer = TaskAnswerData::TrueFalse { value: None };
        assert_eq!(
            serde_json::to_value(&answer).unwrap(),
            json!({ "kind": "TrueFalse", "value": null })
        );

        let answer = TaskAnswerData::Matching {
            mapping: BTreeMap::from([("p1".into(), "p2".into())]),
        };
        assert_eq!(
            serde_json::to_value(&answer).unwrap(),
            json!({ "kind": "Matching", "mapping": { "p1": "p2" } })
        );
    }

    #[test]
    fn answer_roundtrip_all_kinds() {
        let answers = [
            TaskAnswerData::SingleChoice {
                choice_id: Some("a".into()),
            },
            TaskAnswerData::MultipleChoice {
                choice_ids: vec!["a".into(), "b".into()],
            },
            TaskAnswerData::TrueFalse { value: Some(true) },
            TaskAnswerData::Matching {
                mapping: BTreeMap::from([("p1".into(), "p2".into())]),
            },
            TaskAnswerData::Ordering {
                item_ids: vec!["i2".into(), "i1".into()],
            },
            TaskAnswerData::FillInBlank {
                values: BTreeMap::from([("s1".into(), "x".into())]),
            },
            TaskAnswerData::OpenAnswer {
                text: "ответ".into(),
            },
        ];

        for answer in answers {
            let value = serde_json::to_value(&answer).unwrap();
            assert_eq!(value["kind"], json!(answer.kind_name()));
            let back: TaskAnswerData = serde_json::from_value(value).unwrap();
            assert_eq!(back, answer);
        }
    }
}
