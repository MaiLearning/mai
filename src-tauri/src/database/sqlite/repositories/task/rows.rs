//! Приватные row-структуры sqlx::FromRow и сборка wire-моделей
//! из строк БД для гранулярного хранилища task-плагина.

use std::collections::HashMap;

use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::task::service::data::{
    BlankSegmentData, ChoiceData, MatchPairData, OrderingItemData, TaskAnswerData, TaskData,
    TaskKind, TaskKindData, TaskResultData,
};

/// Разбор результата проверки из БД (CHECK-констрейнт гарантирует корректность).
pub(super) fn parse_result(value: &str, context: &str) -> RepoResult<TaskResultData> {
    TaskResultData::parse(value).ok_or_else(|| {
        RepoError::Conflict(format!(
            "Unknown task result '{}' in DB row '{}'",
            value, context
        ))
    })
}

/// Задача из строки tasks: payload вида собирается из групп детей.
pub(super) fn build_task_data(
    row: TaskRow,
    choices: &mut HashMap<String, Vec<ChoiceRow>>,
    pairs: &mut HashMap<String, Vec<MatchPairRow>>,
    items: &mut HashMap<String, Vec<OrderingItemRow>>,
    segments: &mut HashMap<String, Vec<BlankSegmentRow>>,
) -> RepoResult<TaskData> {
    let kind = TaskKind::parse(&row.kind).ok_or_else(|| {
        RepoError::Conflict(format!(
            "Unknown task kind '{}' in DB for task '{}'",
            row.kind, row.id
        ))
    })?;

    let kind_data = match kind {
        TaskKind::SingleChoice => TaskKindData::SingleChoice {
            choices: take_children(choices, &row.id)
                .into_iter()
                .map(ChoiceData::from)
                .collect(),
        },
        TaskKind::MultipleChoice => TaskKindData::MultipleChoice {
            choices: take_children(choices, &row.id)
                .into_iter()
                .map(ChoiceData::from)
                .collect(),
        },
        TaskKind::TrueFalse => TaskKindData::TrueFalse {
            answer: row.answer_bool.unwrap_or(false),
        },
        TaskKind::Matching => TaskKindData::Matching {
            pairs: take_children(pairs, &row.id)
                .into_iter()
                .map(MatchPairData::from)
                .collect(),
        },
        TaskKind::Ordering => TaskKindData::Ordering {
            items: take_children(items, &row.id)
                .into_iter()
                .map(OrderingItemData::from)
                .collect(),
        },
        TaskKind::FillInBlank => TaskKindData::FillInBlank {
            segments: take_children(segments, &row.id)
                .into_iter()
                .map(BlankSegmentData::from)
                .collect(),
        },
        TaskKind::OpenAnswer => TaskKindData::OpenAnswer {
            sample_answer: row.sample_answer.unwrap_or_default(),
            placeholder: row.placeholder.unwrap_or_default(),
        },
    };

    Ok(TaskData {
        id: row.id,
        prompt: row.prompt,
        difficulty: row.difficulty,
        kind: kind_data,
    })
}

/// Забрать группу детей владельца (пустой вектор, если детей нет).
fn take_children<Row>(groups: &mut HashMap<String, Vec<Row>>, owner: &str) -> Vec<Row> {
    groups.remove(owner).unwrap_or_default()
}

/// Ответ из строки прогресса: None — нет ни скаляра, ни детей.
pub(super) fn build_progress_answer(
    row: &ProgressRow,
    answer_choices: &HashMap<String, Vec<AnswerChoiceRow>>,
    answer_matches: &HashMap<String, Vec<AnswerMatchRow>>,
    answer_items: &HashMap<String, Vec<AnswerItemRow>>,
    answer_blanks: &HashMap<String, Vec<AnswerBlankRow>>,
) -> Option<TaskAnswerData> {
    let kind = TaskKind::parse(&row.kind)?;
    let task_id = &row.task_id;

    Some(match kind {
        TaskKind::SingleChoice => TaskAnswerData::SingleChoice {
            choice_id: Some(row.choice_id.clone()?),
        },
        TaskKind::MultipleChoice => TaskAnswerData::MultipleChoice {
            choice_ids: answer_choices
                .get(task_id)?
                .iter()
                .map(|r| r.choice_id.clone())
                .collect(),
        },
        TaskKind::TrueFalse => TaskAnswerData::TrueFalse {
            value: Some(row.value_bool?),
        },
        TaskKind::Matching => TaskAnswerData::Matching {
            mapping: answer_matches
                .get(task_id)?
                .iter()
                .map(|r| (r.left_id.clone(), r.right_id.clone()))
                .collect(),
        },
        TaskKind::Ordering => TaskAnswerData::Ordering {
            item_ids: answer_items
                .get(task_id)?
                .iter()
                .map(|r| r.item_id.clone())
                .collect(),
        },
        TaskKind::FillInBlank => TaskAnswerData::FillInBlank {
            values: answer_blanks
                .get(task_id)?
                .iter()
                .map(|r| (r.segment_id.clone(), r.value.clone()))
                .collect(),
        },
        TaskKind::OpenAnswer => TaskAnswerData::OpenAnswer {
            text: row.text.clone()?,
        },
    })
}

/// Ответ из строки попытки (снимок): None — нет ни скаляра, ни детей.
pub(super) fn build_attempt_answer(
    row: &AttemptRow,
    choices: &HashMap<String, Vec<AttemptChoiceRow>>,
    matches: &HashMap<String, Vec<AttemptMatchRow>>,
    items: &HashMap<String, Vec<AttemptItemRow>>,
    blanks: &HashMap<String, Vec<AttemptBlankRow>>,
) -> Option<TaskAnswerData> {
    let kind = TaskKind::parse(&row.kind)?;
    let attempt_id = &row.id;

    Some(match kind {
        TaskKind::SingleChoice => TaskAnswerData::SingleChoice {
            choice_id: Some(row.choice_id.clone()?),
        },
        TaskKind::MultipleChoice => TaskAnswerData::MultipleChoice {
            choice_ids: choices
                .get(attempt_id)?
                .iter()
                .map(|r| r.choice_id.clone())
                .collect(),
        },
        TaskKind::TrueFalse => TaskAnswerData::TrueFalse {
            value: Some(row.value_bool?),
        },
        TaskKind::Matching => TaskAnswerData::Matching {
            mapping: matches
                .get(attempt_id)?
                .iter()
                .map(|r| (r.left_id.clone(), r.right_id.clone()))
                .collect(),
        },
        TaskKind::Ordering => TaskAnswerData::Ordering {
            item_ids: items
                .get(attempt_id)?
                .iter()
                .map(|r| r.item_id.clone())
                .collect(),
        },
        TaskKind::FillInBlank => TaskAnswerData::FillInBlank {
            values: blanks
                .get(attempt_id)?
                .iter()
                .map(|r| (r.segment_id.clone(), r.value.clone()))
                .collect(),
        },
        TaskKind::OpenAnswer => TaskAnswerData::OpenAnswer {
            text: row.text.clone()?,
        },
    })
}

// ---------------------------------------------------------------------------
// Row-структуры
// ---------------------------------------------------------------------------

#[derive(sqlx::FromRow)]
pub(super) struct TaskRow {
    pub(super) id: String,
    pub(super) kind: String,
    pub(super) prompt: String,
    pub(super) difficulty: String,
    pub(super) answer_bool: Option<bool>,
    pub(super) sample_answer: Option<String>,
    pub(super) placeholder: Option<String>,
}

#[derive(sqlx::FromRow)]
pub(super) struct ChoiceRow {
    pub(super) task_id: String,
    pub(super) id: String,
    pub(super) text: String,
    pub(super) correct: bool,
}

impl From<ChoiceRow> for ChoiceData {
    fn from(r: ChoiceRow) -> Self {
        Self {
            id: r.id,
            text: r.text,
            correct: r.correct,
        }
    }
}

#[derive(sqlx::FromRow)]
pub(super) struct MatchPairRow {
    pub(super) task_id: String,
    pub(super) id: String,
    pub(super) pair_left: String,
    pub(super) pair_right: String,
}

impl From<MatchPairRow> for MatchPairData {
    fn from(r: MatchPairRow) -> Self {
        Self {
            id: r.id,
            left: r.pair_left,
            right: r.pair_right,
        }
    }
}

#[derive(sqlx::FromRow)]
pub(super) struct OrderingItemRow {
    pub(super) task_id: String,
    pub(super) id: String,
    pub(super) text: String,
}

impl From<OrderingItemRow> for OrderingItemData {
    fn from(r: OrderingItemRow) -> Self {
        Self {
            id: r.id,
            text: r.text,
        }
    }
}

#[derive(sqlx::FromRow)]
pub(super) struct BlankSegmentRow {
    pub(super) task_id: String,
    pub(super) id: String,
    pub(super) text: String,
    pub(super) blank: Option<String>,
}

impl From<BlankSegmentRow> for BlankSegmentData {
    fn from(r: BlankSegmentRow) -> Self {
        Self {
            id: r.id,
            text: r.text,
            blank: r.blank,
        }
    }
}

#[derive(sqlx::FromRow)]
pub(super) struct ProgressRow {
    pub(super) task_id: String,
    pub(super) kind: String,
    pub(super) choice_id: Option<String>,
    pub(super) value_bool: Option<bool>,
    pub(super) text: Option<String>,
    pub(super) result: Option<String>,
    pub(super) completed: i64,
}

#[derive(sqlx::FromRow)]
pub(super) struct AnswerChoiceRow {
    pub(super) task_id: String,
    pub(super) choice_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AnswerMatchRow {
    pub(super) task_id: String,
    pub(super) left_id: String,
    pub(super) right_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AnswerItemRow {
    pub(super) task_id: String,
    pub(super) item_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AnswerBlankRow {
    pub(super) task_id: String,
    pub(super) segment_id: String,
    pub(super) value: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AttemptRow {
    pub(super) id: String,
    pub(super) task_id: String,
    pub(super) seq: i64,
    pub(super) kind: String,
    pub(super) choice_id: Option<String>,
    pub(super) value_bool: Option<bool>,
    pub(super) text: Option<String>,
    pub(super) result: String,
    pub(super) checked_at: i64,
}

#[derive(sqlx::FromRow)]
pub(super) struct AttemptChoiceRow {
    pub(super) attempt_id: String,
    pub(super) choice_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AttemptMatchRow {
    pub(super) attempt_id: String,
    pub(super) left_id: String,
    pub(super) right_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AttemptItemRow {
    pub(super) attempt_id: String,
    pub(super) item_id: String,
}

#[derive(sqlx::FromRow)]
pub(super) struct AttemptBlankRow {
    pub(super) attempt_id: String,
    pub(super) segment_id: String,
    pub(super) value: String,
}
