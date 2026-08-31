use std::collections::BTreeMap;

use serde::{Deserialize, Serialize};

use super::answers::TaskAnswerData;
use super::difficulty::CustomDifficultyData;
use super::tasks::TaskData;

/// Результат проверки задачи: `'correct' | 'incorrect'` на проводе и в БД.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TaskResultData {
    Correct,
    Incorrect,
}

impl TaskResultData {
    /// Wire/DB-значение результата.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Correct => "correct",
            Self::Incorrect => "incorrect",
        }
    }

    /// Разбор значения из БД (CHECK-констрейнт гарантирует корректность).
    pub fn parse(value: &str) -> Option<Self> {
        match value {
            "correct" => Some(Self::Correct),
            "incorrect" => Some(Self::Incorrect),
            _ => None,
        }
    }
}

/// Попытка прохождения задачи — снимок ответа на момент проверки.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskAttemptData {
    pub id: String,
    pub task_id: String,
    pub seq: i64,
    pub answer: Option<TaskAnswerData>,
    pub result: TaskResultData,
    pub checked_at: i64,
}

/// Агрегат контента task-ресурса.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskContentData {
    pub tasks: Vec<TaskData>,
    pub difficulties: Vec<CustomDifficultyData>,
    pub answers: BTreeMap<String, TaskAnswerData>,
    pub results: BTreeMap<String, TaskResultData>,
    pub completed: BTreeMap<String, bool>,
}

/// Снапшот контента ресурса вместе с таймстампами корня.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskSnapshotData {
    pub resource_id: String,
    pub content: TaskContentData,
    pub created_at: i64,
    pub updated_at: i64,
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn result_uses_lowercase_wire_names() {
        assert_eq!(
            serde_json::to_value(TaskResultData::Correct).unwrap(),
            json!("correct")
        );
        assert_eq!(
            serde_json::to_value(TaskResultData::Incorrect).unwrap(),
            json!("incorrect")
        );
        assert_eq!(
            TaskResultData::parse("correct"),
            Some(TaskResultData::Correct)
        );
        assert_eq!(TaskResultData::parse("wrong"), None);
    }
}
