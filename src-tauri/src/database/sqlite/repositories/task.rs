//! SQL-реализация гранулярного хранилища task-плагина.
//! Каждая мутация — одна транзакция; корень task_content — get-or-create.
//! Row-структуры и сборка wire-моделей — в rows.rs, тесты — в tests.rs.

mod rows;
#[cfg(test)]
mod tests;

use std::collections::HashMap;

use async_trait::async_trait;
use sqlx::{SqliteConnection, SqlitePool};

use self::rows::{
    build_attempt_answer, build_progress_answer, build_task_data, parse_result, AnswerBlankRow,
    AnswerChoiceRow, AnswerItemRow, AnswerMatchRow, AttemptBlankRow, AttemptChoiceRow,
    AttemptItemRow, AttemptMatchRow, AttemptRow, BlankSegmentRow, ChoiceRow, MatchPairRow,
    OrderingItemRow, ProgressRow, TaskRow,
};
use crate::database::repository::task::TaskRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::plugins::task::service::data::{
    AnswerChildren, AnswerScalars, BlankSegmentData, ChoiceData, CustomDifficultyData,
    MatchPairData, OrderingItemData, TaskAnswerData, TaskAttemptData, TaskContentData, TaskData,
    TaskKindData, TaskResultData, TaskSnapshotData,
};

pub struct SqliteTaskRepository {
    pool: SqlitePool,
}

impl SqliteTaskRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis() as i64
}

/// Группировка дочерних строк по владельцу (task_id / attempt_id);
/// порядок внутри групп сохраняется за счёт ORDER BY в запросах.
fn group<Row>(rows: Vec<Row>, owner: impl Fn(&Row) -> &str) -> HashMap<String, Vec<Row>> {
    let mut groups: HashMap<String, Vec<Row>> = HashMap::new();
    for row in rows {
        groups.entry(owner(&row).to_string()).or_default().push(row);
    }
    groups
}

/// Выборка дочерних строк, ограниченных родительской сущностью (JOIN внутри SQL).
async fn fetch_scoped<Row>(
    db: &mut SqliteConnection,
    sql: &str,
    scope_value: &str,
) -> RepoResult<Vec<Row>>
where
    Row: for<'r> sqlx::FromRow<'r, sqlx::sqlite::SqliteRow> + Send + Unpin,
{
    sqlx::query_as::<_, Row>(sql)
        .bind(scope_value)
        .fetch_all(&mut *db)
        .await
        .map_err(RepoError::Db)
}

#[async_trait]
impl TaskRepository for SqliteTaskRepository {
    async fn ensure_root(&self, resource_id: &str) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        ensure_root_tx(&mut tx, resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn snapshot(&self, resource_id: &str) -> RepoResult<TaskSnapshotData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        ensure_root_tx(&mut tx, resource_id).await?;

        let (created_at, updated_at): (i64, i64) =
            sqlx::query_as("SELECT created_at, updated_at FROM task_content WHERE resource_id = ?")
                .bind(resource_id)
                .fetch_one(&mut *tx)
                .await
                .map_err(RepoError::Db)?;

        let difficulty_rows: Vec<(String, String, String)> = fetch_scoped(
            &mut tx,
            "SELECT id, label, color FROM task_difficulties WHERE resource_id = ? ORDER BY position",
            resource_id,
        ).await?;

        let task_rows: Vec<TaskRow> = fetch_scoped(
            &mut tx,
            "SELECT id, kind, prompt, difficulty, answer_bool, sample_answer, placeholder \
             FROM tasks WHERE resource_id = ? ORDER BY position",
            resource_id,
        )
        .await?;

        // Дети задач и ответы прогресса, сгруппированные по task_id
        let mut choices = group(
            fetch_scoped::<ChoiceRow>(
                &mut tx,
                "SELECT c.task_id, c.id, c.text, c.correct FROM task_choices c \
                 JOIN tasks t ON t.id = c.task_id WHERE t.resource_id = ? ORDER BY c.task_id, c.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let mut pairs = group(
            fetch_scoped::<MatchPairRow>(
                &mut tx,
                "SELECT m.task_id, m.id, m.pair_left, m.pair_right FROM task_match_pairs m \
                 JOIN tasks t ON t.id = m.task_id WHERE t.resource_id = ? ORDER BY m.task_id, m.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let mut items = group(
            fetch_scoped::<OrderingItemRow>(
                &mut tx,
                "SELECT o.task_id, o.id, o.text FROM task_ordering_items o \
                 JOIN tasks t ON t.id = o.task_id WHERE t.resource_id = ? ORDER BY o.task_id, o.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let mut segments = group(
            fetch_scoped::<BlankSegmentRow>(
                &mut tx,
                "SELECT s.task_id, s.id, s.text, s.blank FROM task_blank_segments s \
                 JOIN tasks t ON t.id = s.task_id WHERE t.resource_id = ? ORDER BY s.task_id, s.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let progress_rows: Vec<ProgressRow> = fetch_scoped(
            &mut tx,
            "SELECT p.task_id, p.kind, p.choice_id, p.value_bool, p.text, p.result, p.completed \
             FROM task_progress p JOIN tasks t ON t.id = p.task_id WHERE t.resource_id = ?",
            resource_id,
        )
        .await?;
        let answer_choices = group(
            fetch_scoped::<AnswerChoiceRow>(
                &mut tx,
                "SELECT a.task_id, a.choice_id FROM task_answer_choices a \
                 JOIN tasks t ON t.id = a.task_id WHERE t.resource_id = ? ORDER BY a.task_id, a.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let answer_matches = group(
            fetch_scoped::<AnswerMatchRow>(
                &mut tx,
                "SELECT a.task_id, a.left_id, a.right_id FROM task_answer_matches a \
                 JOIN tasks t ON t.id = a.task_id WHERE t.resource_id = ? ORDER BY a.task_id, a.left_id",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let answer_items = group(
            fetch_scoped::<AnswerItemRow>(
                &mut tx,
                "SELECT a.task_id, a.item_id FROM task_answer_items a \
                 JOIN tasks t ON t.id = a.task_id WHERE t.resource_id = ? ORDER BY a.task_id, a.position",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );
        let answer_blanks = group(
            fetch_scoped::<AnswerBlankRow>(
                &mut tx,
                "SELECT a.task_id, a.segment_id, a.value FROM task_answer_blanks a \
                 JOIN tasks t ON t.id = a.task_id WHERE t.resource_id = ? ORDER BY a.task_id, a.segment_id",
                resource_id,
            ).await?,
            |r| r.task_id.as_str(),
        );

        tx.commit().await.map_err(RepoError::Db)?;

        let mut tasks = Vec::with_capacity(task_rows.len());
        for row in task_rows {
            tasks.push(build_task_data(
                row,
                &mut choices,
                &mut pairs,
                &mut items,
                &mut segments,
            )?);
        }

        // Прогресс → answers (есть скаляр или дети), results (result NOT NULL), completed (1)
        let mut answers = HashMap::new();
        let mut results = HashMap::new();
        let mut completed = HashMap::new();
        for row in progress_rows {
            if let Some(answer) = build_progress_answer(
                &row,
                &answer_choices,
                &answer_matches,
                &answer_items,
                &answer_blanks,
            ) {
                answers.insert(row.task_id.clone(), answer);
            }
            if let Some(result_str) = &row.result {
                let result = parse_result(result_str, &row.task_id)?;
                results.insert(row.task_id.clone(), result);
            }
            if row.completed != 0 {
                completed.insert(row.task_id.clone(), true);
            }
        }

        Ok(TaskSnapshotData {
            resource_id: resource_id.to_string(),
            content: TaskContentData {
                tasks,
                difficulties: difficulty_rows
                    .into_iter()
                    .map(|(id, label, color)| CustomDifficultyData { id, label, color })
                    .collect(),
                answers: answers.into_iter().collect(),
                results: results.into_iter().collect(),
                completed: completed.into_iter().collect(),
            },
            created_at,
            updated_at,
        })
    }

    async fn create_task(&self, resource_id: &str, task: TaskData) -> RepoResult<TaskData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        ensure_root_tx(&mut tx, resource_id).await?;

        let (position,): (i64,) = sqlx::query_as(
            "SELECT COALESCE(MAX(position), -1) + 1 FROM tasks WHERE resource_id = ?",
        )
        .bind(resource_id)
        .fetch_one(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        insert_task_scalars_tx(&mut tx, resource_id, &task, position).await?;
        if let Some(children) = task_children(&task.kind) {
            insert_task_children_tx(&mut tx, &task.id, &children).await?;
        }
        bump_root_tx(&mut tx, resource_id).await?;

        tx.commit().await.map_err(RepoError::Db)?;
        Ok(task)
    }

    async fn update_task(&self, task_id: &str, task: TaskData) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        let resource_id = task_owner_tx(&mut tx, task_id).await?;

        let (answer_bool, sample_answer, placeholder) = kind_scalars(&task.kind);
        sqlx::query(
            "UPDATE tasks SET kind = ?, prompt = ?, difficulty = ?, \
                 answer_bool = ?, sample_answer = ?, placeholder = ? \
             WHERE id = ?",
        )
        .bind(task.kind.kind_name())
        .bind(&task.prompt)
        .bind(&task.difficulty)
        .bind(answer_bool)
        .bind(sample_answer)
        .bind(placeholder)
        .bind(task_id)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        // Дети перезаписываются под новый вид; прогресс прохождения сбрасывается
        delete_task_children_tx(&mut tx, task_id).await?;
        if let Some(children) = task_children(&task.kind) {
            insert_task_children_tx(&mut tx, task_id, &children).await?;
        }
        sqlx::query("DELETE FROM task_progress WHERE task_id = ?")
            .bind(task_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn update_task_difficulty(&self, task_id: &str, difficulty: &str) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        let resource_id = task_owner_tx(&mut tx, task_id).await?;

        sqlx::query("UPDATE tasks SET difficulty = ? WHERE id = ?")
            .bind(difficulty)
            .bind(task_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn delete_task(&self, task_id: &str) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let (resource_id, position): (String, i64) =
            sqlx::query_as("SELECT resource_id, position FROM tasks WHERE id = ?")
                .bind(task_id)
                .fetch_optional(&mut *tx)
                .await
                .map_err(RepoError::Db)?
                .ok_or_else(|| RepoError::NotFound(format!("Task '{}' not found", task_id)))?;

        // Дети, прогресс и попытки уходят каскадом
        sqlx::query("DELETE FROM tasks WHERE id = ?")
            .bind(task_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        // Перенормализация позиций после удаления
        sqlx::query(
            "UPDATE tasks SET position = position - 1 WHERE resource_id = ? AND position > ?",
        )
        .bind(&resource_id)
        .bind(position)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn set_difficulties(
        &self,
        resource_id: &str,
        difficulties: Vec<CustomDifficultyData>,
    ) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        ensure_root_tx(&mut tx, resource_id).await?;

        sqlx::query("DELETE FROM task_difficulties WHERE resource_id = ?")
            .bind(resource_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;

        for (position, difficulty) in difficulties.iter().enumerate() {
            sqlx::query(
                "INSERT INTO task_difficulties (resource_id, id, label, color, position) \
                 VALUES (?, ?, ?, ?, ?)",
            )
            .bind(resource_id)
            .bind(&difficulty.id)
            .bind(&difficulty.label)
            .bind(&difficulty.color)
            .bind(position as i64)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;
        }

        bump_root_tx(&mut tx, resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn task_kind(&self, task_id: &str) -> RepoResult<String> {
        let row: Option<(String,)> = sqlx::query_as("SELECT kind FROM tasks WHERE id = ?")
            .bind(task_id)
            .fetch_optional(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        row.map(|r| r.0)
            .ok_or_else(|| RepoError::NotFound(format!("Task '{}' not found", task_id)))
    }

    async fn upsert_progress(&self, task_id: &str, answer: TaskAnswerData) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        let resource_id = task_owner_tx(&mut tx, task_id).await?;

        upsert_progress_tx(&mut tx, task_id, &answer).await?;
        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn set_task_result(
        &self,
        task_id: &str,
        answer: Option<TaskAnswerData>,
        result: TaskResultData,
    ) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let (task_kind, resource_id): (String, String) =
            sqlx::query_as("SELECT kind, resource_id FROM tasks WHERE id = ?")
                .bind(task_id)
                .fetch_optional(&mut *tx)
                .await
                .map_err(RepoError::Db)?
                .ok_or_else(|| RepoError::NotFound(format!("Task '{}' not found", task_id)))?;

        if let Some(answer) = &answer {
            upsert_progress_tx(&mut tx, task_id, answer).await?;
        }

        // result + completed; строка прогресса создаётся при отсутствии
        sqlx::query(
            "INSERT INTO task_progress (task_id, kind, result, completed) \
             VALUES (?, ?, ?, 1) \
             ON CONFLICT(task_id) DO UPDATE SET result = excluded.result, completed = 1",
        )
        .bind(task_id)
        .bind(&task_kind)
        .bind(result.as_str())
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        // Попытка со снимком ответа (kind ответа, либо kind задачи если answer = None)
        let attempt_id = uuid::Uuid::new_v4().to_string();
        let kind = answer
            .as_ref()
            .map(|a| a.kind_name())
            .unwrap_or(task_kind.as_str());
        let scalars = answer.as_ref().map(|a| a.scalars()).unwrap_or_default();
        sqlx::query(
            "INSERT INTO task_attempts (id, task_id, seq, kind, choice_id, value_bool, text, result, checked_at) \
             VALUES (?, ?, (SELECT COALESCE(MAX(seq), 0) + 1 FROM task_attempts WHERE task_id = ?), ?, ?, ?, ?, ?, ?)",
        )
        .bind(&attempt_id)
        .bind(task_id)
        .bind(task_id)
        .bind(kind)
        .bind(scalars.choice_id)
        .bind(scalars.value_bool)
        .bind(scalars.text)
        .bind(result.as_str())
        .bind(now_millis())
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        if let Some(answer) = &answer {
            insert_answer_children_tx(&mut tx, AnswerScope::Attempt, &attempt_id, answer).await?;
        }

        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn reset_progress(&self, task_id: &str) -> RepoResult<()> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;
        let resource_id = task_owner_tx(&mut tx, task_id).await?;

        // Скаляры и result очищаются; completed не трогается; дети ответа удаляются
        sqlx::query(
            "UPDATE task_progress SET choice_id = NULL, value_bool = NULL, text = NULL, result = NULL \
             WHERE task_id = ?",
        )
        .bind(task_id)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        delete_answer_children_tx(&mut tx, task_id).await?;
        bump_root_tx(&mut tx, &resource_id).await?;
        tx.commit().await.map_err(RepoError::Db)
    }

    async fn attempts(&self, task_id: &str) -> RepoResult<Vec<TaskAttemptData>> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let rows: Vec<AttemptRow> = fetch_scoped(
            &mut tx,
            "SELECT id, task_id, seq, kind, choice_id, value_bool, text, result, checked_at \
             FROM task_attempts WHERE task_id = ? ORDER BY seq",
            task_id,
        )
        .await?;

        // Дети попыток, сгруппированные по attempt_id
        let choices = group(
            fetch_scoped::<AttemptChoiceRow>(
                &mut tx,
                "SELECT c.attempt_id, c.choice_id FROM task_attempt_choices c \
                 JOIN task_attempts a ON a.id = c.attempt_id WHERE a.task_id = ? \
                 ORDER BY c.attempt_id, c.position",
                task_id,
            )
            .await?,
            |r| r.attempt_id.as_str(),
        );
        let matches = group(
            fetch_scoped::<AttemptMatchRow>(
                &mut tx,
                "SELECT m.attempt_id, m.left_id, m.right_id FROM task_attempt_matches m \
                 JOIN task_attempts a ON a.id = m.attempt_id WHERE a.task_id = ? \
                 ORDER BY m.attempt_id, m.left_id",
                task_id,
            )
            .await?,
            |r| r.attempt_id.as_str(),
        );
        let items = group(
            fetch_scoped::<AttemptItemRow>(
                &mut tx,
                "SELECT i.attempt_id, i.item_id FROM task_attempt_items i \
                 JOIN task_attempts a ON a.id = i.attempt_id WHERE a.task_id = ? \
                 ORDER BY i.attempt_id, i.position",
                task_id,
            )
            .await?,
            |r| r.attempt_id.as_str(),
        );
        let blanks = group(
            fetch_scoped::<AttemptBlankRow>(
                &mut tx,
                "SELECT b.attempt_id, b.segment_id, b.value FROM task_attempt_blanks b \
                 JOIN task_attempts a ON a.id = b.attempt_id WHERE a.task_id = ? \
                 ORDER BY b.attempt_id, b.segment_id",
                task_id,
            )
            .await?,
            |r| r.attempt_id.as_str(),
        );

        tx.commit().await.map_err(RepoError::Db)?;

        rows.into_iter()
            .map(|row| {
                let result = parse_result(&row.result, &row.id)?;
                let answer = build_attempt_answer(&row, &choices, &matches, &items, &blanks);
                Ok(TaskAttemptData {
                    id: row.id,
                    task_id: row.task_id,
                    seq: row.seq,
                    answer,
                    result,
                    checked_at: row.checked_at,
                })
            })
            .collect()
    }
}

// ---------------------------------------------------------------------------
// Транзакционные хелперы (общие для мутаций)
// ---------------------------------------------------------------------------

/// Get-or-create корня task_content (таймстампы проставят DEFAULT).
async fn ensure_root_tx(db: &mut SqliteConnection, resource_id: &str) -> RepoResult<()> {
    sqlx::query("INSERT OR IGNORE INTO task_content (resource_id) VALUES (?)")
        .bind(resource_id)
        .execute(db)
        .await
        .map_err(RepoError::Db)?;
    Ok(())
}

/// Bump updated_at корня — в той же транзакции, что и мутация.
async fn bump_root_tx(db: &mut SqliteConnection, resource_id: &str) -> RepoResult<()> {
    sqlx::query("UPDATE task_content SET updated_at = ? WHERE resource_id = ?")
        .bind(now_millis())
        .bind(resource_id)
        .execute(db)
        .await
        .map_err(RepoError::Db)?;
    Ok(())
}

/// resource_id задачи; NotFound если задачи нет.
async fn task_owner_tx(db: &mut SqliteConnection, task_id: &str) -> RepoResult<String> {
    sqlx::query_as::<_, (String,)>("SELECT resource_id FROM tasks WHERE id = ?")
        .bind(task_id)
        .fetch_optional(&mut *db)
        .await
        .map_err(RepoError::Db)?
        .map(|r| r.0)
        .ok_or_else(|| RepoError::NotFound(format!("Task '{}' not found", task_id)))
}

/// Скалярные колонки tasks по виду: (answer_bool, sample_answer, placeholder).
fn kind_scalars(kind: &TaskKindData) -> (Option<bool>, Option<String>, Option<String>) {
    match kind {
        TaskKindData::TrueFalse { answer } => (Some(*answer), None, None),
        TaskKindData::OpenAnswer {
            sample_answer,
            placeholder,
        } => (None, Some(sample_answer.clone()), Some(placeholder.clone())),
        _ => (None, None, None),
    }
}

/// Дочерние строки определения задачи по виду; None — у вида нет коллекций.
enum TaskChildRows {
    Choices(Vec<ChoiceData>),
    Pairs(Vec<MatchPairData>),
    Items(Vec<OrderingItemData>),
    Segments(Vec<BlankSegmentData>),
}

fn task_children(kind: &TaskKindData) -> Option<TaskChildRows> {
    match kind {
        TaskKindData::SingleChoice { choices } | TaskKindData::MultipleChoice { choices } => {
            Some(TaskChildRows::Choices(choices.clone()))
        }
        TaskKindData::Matching { pairs } => Some(TaskChildRows::Pairs(pairs.clone())),
        TaskKindData::Ordering { items } => Some(TaskChildRows::Items(items.clone())),
        TaskKindData::FillInBlank { segments } => Some(TaskChildRows::Segments(segments.clone())),
        TaskKindData::TrueFalse { .. } | TaskKindData::OpenAnswer { .. } => None,
    }
}

/// INSERT строки tasks: общие скаляры + kind-скаляры + позиция.
async fn insert_task_scalars_tx(
    db: &mut SqliteConnection,
    resource_id: &str,
    task: &TaskData,
    position: i64,
) -> RepoResult<()> {
    let (answer_bool, sample_answer, placeholder) = kind_scalars(&task.kind);
    sqlx::query(
        "INSERT INTO tasks (id, resource_id, kind, prompt, difficulty, position, \
             answer_bool, sample_answer, placeholder) \
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&task.id)
    .bind(resource_id)
    .bind(task.kind.kind_name())
    .bind(&task.prompt)
    .bind(&task.difficulty)
    .bind(position)
    .bind(answer_bool)
    .bind(sample_answer)
    .bind(placeholder)
    .execute(&mut *db)
    .await
    .map_err(RepoError::Db)?;
    Ok(())
}

/// INSERT детей задачи; position = индекс в массиве wire-контракта.
async fn insert_task_children_tx(
    db: &mut SqliteConnection,
    task_id: &str,
    children: &TaskChildRows,
) -> RepoResult<()> {
    match children {
        TaskChildRows::Choices(rows) => {
            for (position, row) in rows.iter().enumerate() {
                sqlx::query(
                    "INSERT INTO task_choices (id, task_id, text, correct, position) \
                     VALUES (?, ?, ?, ?, ?)",
                )
                .bind(&row.id)
                .bind(task_id)
                .bind(&row.text)
                .bind(row.correct)
                .bind(position as i64)
                .execute(&mut *db)
                .await
                .map_err(RepoError::Db)?;
            }
        }
        TaskChildRows::Pairs(rows) => {
            for (position, row) in rows.iter().enumerate() {
                sqlx::query(
                    "INSERT INTO task_match_pairs (id, task_id, pair_left, pair_right, position) \
                     VALUES (?, ?, ?, ?, ?)",
                )
                .bind(&row.id)
                .bind(task_id)
                .bind(&row.left)
                .bind(&row.right)
                .bind(position as i64)
                .execute(&mut *db)
                .await
                .map_err(RepoError::Db)?;
            }
        }
        TaskChildRows::Items(rows) => {
            for (position, row) in rows.iter().enumerate() {
                sqlx::query(
                    "INSERT INTO task_ordering_items (id, task_id, text, position) \
                     VALUES (?, ?, ?, ?)",
                )
                .bind(&row.id)
                .bind(task_id)
                .bind(&row.text)
                .bind(position as i64)
                .execute(&mut *db)
                .await
                .map_err(RepoError::Db)?;
            }
        }
        TaskChildRows::Segments(rows) => {
            for (position, row) in rows.iter().enumerate() {
                sqlx::query(
                    "INSERT INTO task_blank_segments (id, task_id, text, blank, position) \
                     VALUES (?, ?, ?, ?, ?)",
                )
                .bind(&row.id)
                .bind(task_id)
                .bind(&row.text)
                .bind(&row.blank)
                .bind(position as i64)
                .execute(&mut *db)
                .await
                .map_err(RepoError::Db)?;
            }
        }
    }
    Ok(())
}

/// Таблицы детей определения задачи — удаляются все перед перезаписью.
const TASK_CHILD_TABLES: [&str; 4] = [
    "task_choices",
    "task_match_pairs",
    "task_ordering_items",
    "task_blank_segments",
];

async fn delete_task_children_tx(db: &mut SqliteConnection, task_id: &str) -> RepoResult<()> {
    for table in TASK_CHILD_TABLES {
        let sql = format!("DELETE FROM {} WHERE task_id = ?", table);
        sqlx::query(&sql)
            .bind(task_id)
            .execute(&mut *db)
            .await
            .map_err(RepoError::Db)?;
    }
    Ok(())
}

/// Семейство таблиц дочерних строк ответа: прогресс или попытка.
#[derive(Clone, Copy)]
enum AnswerScope {
    /// task_answer_* (владелец — task_id)
    Progress,
    /// task_attempt_* (владелец — attempt_id)
    Attempt,
}

impl AnswerScope {
    fn choices_table(self) -> &'static str {
        match self {
            Self::Progress => "task_answer_choices",
            Self::Attempt => "task_attempt_choices",
        }
    }

    fn matches_table(self) -> &'static str {
        match self {
            Self::Progress => "task_answer_matches",
            Self::Attempt => "task_attempt_matches",
        }
    }

    fn items_table(self) -> &'static str {
        match self {
            Self::Progress => "task_answer_items",
            Self::Attempt => "task_attempt_items",
        }
    }

    fn blanks_table(self) -> &'static str {
        match self {
            Self::Progress => "task_answer_blanks",
            Self::Attempt => "task_attempt_blanks",
        }
    }

    /// Колонка-владелец строк: task_id у прогресса, attempt_id у попытки.
    fn owner_col(self) -> &'static str {
        match self {
            Self::Progress => "task_id",
            Self::Attempt => "attempt_id",
        }
    }
}

/// INSERT дочерних строк ответа в таблицы выбранного семейства.
async fn insert_answer_children_tx(
    db: &mut SqliteConnection,
    scope: AnswerScope,
    owner_id: &str,
    answer: &TaskAnswerData,
) -> RepoResult<()> {
    let Some(children) = answer.children() else {
        return Ok(());
    };

    match children {
        AnswerChildren::Choices(rows) => {
            let sql = format!(
                "INSERT INTO {} ({}, choice_id, position) VALUES (?, ?, ?)",
                scope.choices_table(),
                scope.owner_col()
            );
            for (choice_id, position) in rows {
                sqlx::query(&sql)
                    .bind(owner_id)
                    .bind(choice_id)
                    .bind(position)
                    .execute(&mut *db)
                    .await
                    .map_err(RepoError::Db)?;
            }
        }
        AnswerChildren::Matches(rows) => {
            let sql = format!(
                "INSERT INTO {} ({}, left_id, right_id) VALUES (?, ?, ?)",
                scope.matches_table(),
                scope.owner_col()
            );
            for (left_id, right_id) in rows {
                sqlx::query(&sql)
                    .bind(owner_id)
                    .bind(left_id)
                    .bind(right_id)
                    .execute(&mut *db)
                    .await
                    .map_err(RepoError::Db)?;
            }
        }
        AnswerChildren::Items(rows) => {
            let sql = format!(
                "INSERT INTO {} ({}, item_id, position) VALUES (?, ?, ?)",
                scope.items_table(),
                scope.owner_col()
            );
            for (item_id, position) in rows {
                sqlx::query(&sql)
                    .bind(owner_id)
                    .bind(item_id)
                    .bind(position)
                    .execute(&mut *db)
                    .await
                    .map_err(RepoError::Db)?;
            }
        }
        AnswerChildren::Blanks(rows) => {
            let sql = format!(
                "INSERT INTO {} ({}, segment_id, value) VALUES (?, ?, ?)",
                scope.blanks_table(),
                scope.owner_col()
            );
            for (segment_id, value) in rows {
                sqlx::query(&sql)
                    .bind(owner_id)
                    .bind(segment_id)
                    .bind(value)
                    .execute(&mut *db)
                    .await
                    .map_err(RepoError::Db)?;
            }
        }
    }
    Ok(())
}

/// Таблицы дочерних строк ответа прогресса — удаляются все перед перезаписью.
const ANSWER_CHILD_TABLES: [&str; 4] = [
    "task_answer_choices",
    "task_answer_matches",
    "task_answer_items",
    "task_answer_blanks",
];

async fn delete_answer_children_tx(db: &mut SqliteConnection, task_id: &str) -> RepoResult<()> {
    for table in ANSWER_CHILD_TABLES {
        let sql = format!("DELETE FROM {} WHERE task_id = ?", table);
        sqlx::query(&sql)
            .bind(task_id)
            .execute(&mut *db)
            .await
            .map_err(RepoError::Db)?;
    }
    Ok(())
}

/// Upsert строки прогресса ответом: kind/скаляры + перезапись детей;
/// result/completed не трогаются.
async fn upsert_progress_tx(
    db: &mut SqliteConnection,
    task_id: &str,
    answer: &TaskAnswerData,
) -> RepoResult<()> {
    let scalars: AnswerScalars = answer.scalars();
    sqlx::query(
        "INSERT INTO task_progress (task_id, kind, choice_id, value_bool, text) \
         VALUES (?, ?, ?, ?, ?) \
         ON CONFLICT(task_id) DO UPDATE SET \
            kind = excluded.kind, \
            choice_id = excluded.choice_id, \
            value_bool = excluded.value_bool, \
            text = excluded.text",
    )
    .bind(task_id)
    .bind(answer.kind_name())
    .bind(scalars.choice_id)
    .bind(scalars.value_bool)
    .bind(scalars.text)
    .execute(&mut *db)
    .await
    .map_err(RepoError::Db)?;

    delete_answer_children_tx(db, task_id).await?;
    insert_answer_children_tx(db, AnswerScope::Progress, task_id, answer).await
}
