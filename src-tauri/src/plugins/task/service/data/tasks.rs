use serde::{Deserialize, Serialize};

/// Задача: общие поля { id, prompt, difficulty } + payload вида через flatten,
/// на проводе — плоский JSON с тегом `kind` (значения PascalCase, как в Rust).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskData {
    pub id: String,
    pub prompt: String,
    pub difficulty: String,
    #[serde(flatten)]
    pub kind: TaskKindData,
}

/// Payload по виду задачи; тег `kind` — имя варианта без переименования.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all_fields = "camelCase")]
pub enum TaskKindData {
    SingleChoice {
        choices: Vec<ChoiceData>,
    },
    MultipleChoice {
        choices: Vec<ChoiceData>,
    },
    TrueFalse {
        answer: bool,
    },
    Matching {
        pairs: Vec<MatchPairData>,
    },
    Ordering {
        items: Vec<OrderingItemData>,
    },
    FillInBlank {
        segments: Vec<BlankSegmentData>,
    },
    OpenAnswer {
        sample_answer: String,
        placeholder: String,
    },
}

/// Вариант ответа: `{ id, text, correct }`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChoiceData {
    pub id: String,
    pub text: String,
    pub correct: bool,
}

/// Пара соответствия: `{ id, left, right }`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MatchPairData {
    pub id: String,
    pub left: String,
    pub right: String,
}

/// Элемент упорядочивания: `{ id, text }`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderingItemData {
    pub id: String,
    pub text: String,
}

/// Сегмент заполнения пропусков: `{ id, text, blank: string | null }`.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BlankSegmentData {
    pub id: String,
    pub text: String,
    pub blank: Option<String>,
}

/// Вид задачи — внутреннее перечисление поверх wire-имён тега `kind`.
/// Гарантирует исчерпывающие match'и при работе с колонкой `kind` в БД.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TaskKind {
    SingleChoice,
    MultipleChoice,
    TrueFalse,
    Matching,
    Ordering,
    FillInBlank,
    OpenAnswer,
}

impl TaskKind {
    /// Все виды задач в фиксированном порядке.
    pub const ALL: [TaskKind; 7] = [
        TaskKind::SingleChoice,
        TaskKind::MultipleChoice,
        TaskKind::TrueFalse,
        TaskKind::Matching,
        TaskKind::Ordering,
        TaskKind::FillInBlank,
        TaskKind::OpenAnswer,
    ];

    /// Wire-имя вида задачи (значение тега `kind`, колонка `kind` в БД).
    pub fn as_str(self) -> &'static str {
        match self {
            Self::SingleChoice => "SingleChoice",
            Self::MultipleChoice => "MultipleChoice",
            Self::TrueFalse => "TrueFalse",
            Self::Matching => "Matching",
            Self::Ordering => "Ordering",
            Self::FillInBlank => "FillInBlank",
            Self::OpenAnswer => "OpenAnswer",
        }
    }

    /// Разбор wire-имени вида задачи.
    pub fn parse(name: &str) -> Option<Self> {
        Self::ALL.into_iter().find(|kind| kind.as_str() == name)
    }
}

impl TaskKindData {
    /// Имя вида задачи для тега `kind` / колонки `kind` в БД.
    pub fn kind_name(&self) -> &'static str {
        match self {
            Self::SingleChoice { .. } => TaskKind::SingleChoice.as_str(),
            Self::MultipleChoice { .. } => TaskKind::MultipleChoice.as_str(),
            Self::TrueFalse { .. } => TaskKind::TrueFalse.as_str(),
            Self::Matching { .. } => TaskKind::Matching.as_str(),
            Self::Ordering { .. } => TaskKind::Ordering.as_str(),
            Self::FillInBlank { .. } => TaskKind::FillInBlank.as_str(),
            Self::OpenAnswer { .. } => TaskKind::OpenAnswer.as_str(),
        }
    }
}

/// Новая задача с дефолтным содержимым по виду (kind уже валидирован правилами сервиса).
pub fn default_task(id: String, kind: TaskKind) -> TaskData {
    let kind = match kind {
        TaskKind::SingleChoice => TaskKindData::SingleChoice {
            choices: vec![ChoiceData {
                id: "a".into(),
                text: String::new(),
                correct: true,
            }],
        },
        TaskKind::MultipleChoice => TaskKindData::MultipleChoice {
            choices: vec![
                ChoiceData {
                    id: "a".into(),
                    text: String::new(),
                    correct: true,
                },
                ChoiceData {
                    id: "b".into(),
                    text: String::new(),
                    correct: false,
                },
            ],
        },
        TaskKind::TrueFalse => TaskKindData::TrueFalse { answer: true },
        TaskKind::Matching => TaskKindData::Matching {
            pairs: vec![
                MatchPairData {
                    id: "p1".into(),
                    left: String::new(),
                    right: String::new(),
                },
                MatchPairData {
                    id: "p2".into(),
                    left: String::new(),
                    right: String::new(),
                },
            ],
        },
        TaskKind::Ordering => TaskKindData::Ordering {
            items: vec![
                OrderingItemData {
                    id: "i1".into(),
                    text: String::new(),
                },
                OrderingItemData {
                    id: "i2".into(),
                    text: String::new(),
                },
            ],
        },
        TaskKind::FillInBlank => TaskKindData::FillInBlank {
            segments: vec![BlankSegmentData {
                id: "s1".into(),
                text: String::new(),
                blank: None,
            }],
        },
        TaskKind::OpenAnswer => TaskKindData::OpenAnswer {
            sample_answer: String::new(),
            placeholder: String::new(),
        },
    };

    TaskData {
        id,
        prompt: String::new(),
        difficulty: "easy".into(),
        kind,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn task_serializes_flat_contract_json() {
        let task = TaskData {
            id: "t1".into(),
            prompt: "Вопрос".into(),
            difficulty: "easy".into(),
            kind: TaskKindData::OpenAnswer {
                sample_answer: "образец".into(),
                placeholder: "подсказка".into(),
            },
        };

        let value = serde_json::to_value(&task).unwrap();
        assert_eq!(
            value,
            json!({
                "id": "t1",
                "kind": "OpenAnswer",
                "prompt": "Вопрос",
                "difficulty": "easy",
                "sampleAnswer": "образец",
                "placeholder": "подсказка"
            })
        );

        let back: TaskData = serde_json::from_value(value).unwrap();
        assert_eq!(back, task);
    }

    #[test]
    fn task_roundtrip_all_kinds() {
        for kind in TaskKind::ALL {
            let task = default_task("t1".into(), kind);
            let value = serde_json::to_value(&task).unwrap();
            assert_eq!(value["kind"], json!(kind.as_str()));
            let back: TaskData = serde_json::from_value(value).unwrap();
            assert_eq!(back, task);
        }
    }

    #[test]
    fn task_kind_parse_uses_wire_names() {
        assert_eq!(
            TaskKind::parse("SingleChoice"),
            Some(TaskKind::SingleChoice)
        );
        assert_eq!(TaskKind::parse("FillInBlank"), Some(TaskKind::FillInBlank));
        assert_eq!(TaskKind::parse("single_choice"), None);
        assert_eq!(TaskKind::parse("Nope"), None);
    }
}
