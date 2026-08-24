// SQLite-реализация CourseRepository.
// Теги хранятся в таблицах tags (общий реестр) и course_tags (связь many-to-many)
// и синхронизируются в одной транзакции с записью курса.

use std::collections::HashMap;

use async_trait::async_trait;
use sqlx::SqlitePool;

use crate::database::repository::course::CourseRepository;
use crate::database::repository::{RepoError, RepoResult};
use crate::services::course::CourseData;

pub struct SqliteCourseRepository {
    pool: SqlitePool,
}

impl SqliteCourseRepository {
    pub fn new(pool: SqlitePool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl CourseRepository for SqliteCourseRepository {
    async fn all_courses(&self) -> RepoResult<Vec<CourseData>> {
        let rows = sqlx::query_as::<_, CourseRow>(
            "SELECT id, name, description, color_from, color_to, status, created_at, updated_at \
             FROM courses ORDER BY name",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        // Теги всех курсов одним запросом, группируем по course_id.
        let tag_rows = sqlx::query_as::<_, (String, String)>(
            "SELECT ct.course_id, t.name \
             FROM course_tags ct JOIN tags t ON t.id = ct.tag_id ORDER BY t.name",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        let mut tags_by_course: HashMap<String, Vec<String>> = HashMap::new();
        for (course_id, tag) in tag_rows {
            tags_by_course.entry(course_id).or_default().push(tag);
        }

        Ok(rows
            .into_iter()
            .map(|r| {
                let tags = tags_by_course.remove(&r.id).unwrap_or_default();
                r.into_data(tags)
            })
            .collect())
    }

    async fn get_course(&self, id: &str) -> RepoResult<CourseData> {
        let row = sqlx::query_as::<_, CourseRow>(
            "SELECT id, name, description, color_from, color_to, status, created_at, updated_at \
             FROM courses WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("Course '{}' not found", id)))?;

        let tags = sqlx::query_scalar(
            "SELECT t.name FROM course_tags ct JOIN tags t ON t.id = ct.tag_id \
             WHERE ct.course_id = ? ORDER BY t.name",
        )
        .bind(id)
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(row.into_data(tags))
    }

    async fn create_course(&self, data: CourseData) -> RepoResult<CourseData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let result = sqlx::query(
            "INSERT INTO courses (id, name, description, topic, color_from, color_to, status, created_at, updated_at) \
             VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.color_from)
        .bind(&data.color_to)
        .bind(&data.status)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&mut *tx)
        .await;

        match result {
            Ok(_) => {}
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => {
                return Err(RepoError::Conflict(format!(
                    "Course with id '{}' already exists",
                    data.id
                )));
            }
            Err(e) => return Err(RepoError::Db(e)),
        }

        sync_course_tags(&mut tx, &data.id, &data.tags).await?;
        tx.commit().await.map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn update_course(&self, data: CourseData) -> RepoResult<CourseData> {
        let mut tx = self.pool.begin().await.map_err(RepoError::Db)?;

        let result = sqlx::query(
            "UPDATE courses SET name = ?, description = ?, color_from = ?, color_to = ?, status = ?, \
             created_at = ?, updated_at = ? WHERE id = ?",
        )
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.color_from)
        .bind(&data.color_to)
        .bind(&data.status)
        .bind(data.created_at)
        .bind(data.updated_at)
        .bind(&data.id)
        .execute(&mut *tx)
        .await
        .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Course '{}' not found",
                data.id
            )));
        }

        // Полная пересинхронизация набора тегов курса.
        sqlx::query("DELETE FROM course_tags WHERE course_id = ?")
            .bind(&data.id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;
        sync_course_tags(&mut tx, &data.id, &data.tags).await?;

        tx.commit().await.map_err(RepoError::Db)?;

        Ok(data)
    }

    async fn delete_course(&self, id: &str) -> RepoResult<CourseData> {
        let data = self.get_course(id).await?;

        sqlx::query("DELETE FROM courses WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(RepoError::Db)?;

        Ok(data)
    }
}

/// Привязывает курс к тегам: существующие имена переиспользует, новые создаёт.
async fn sync_course_tags(
    tx: &mut sqlx::SqliteConnection,
    course_id: &str,
    tags: &[String],
) -> RepoResult<()> {
    for tag in tags {
        let existing: Option<String> =
            sqlx::query_scalar("SELECT id FROM tags WHERE name = ? COLLATE NOCASE")
                .bind(tag)
                .fetch_optional(&mut *tx)
                .await
                .map_err(RepoError::Db)?;

        let tag_id = match existing {
            Some(id) => id,
            None => {
                let id = uuid::Uuid::new_v4().to_string();
                let now = std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .map(|d| d.as_millis() as i64)
                    .unwrap_or(0);
                sqlx::query("INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)")
                    .bind(&id)
                    .bind(tag)
                    .bind(now)
                    .execute(&mut *tx)
                    .await
                    .map_err(RepoError::Db)?;
                id
            }
        };

        sqlx::query("INSERT OR IGNORE INTO course_tags (course_id, tag_id) VALUES (?, ?)")
            .bind(course_id)
            .bind(&tag_id)
            .execute(&mut *tx)
            .await
            .map_err(RepoError::Db)?;
    }
    Ok(())
}

// ---------------------------------------------------------------------------
// Внутренняя строка для загрузки из SQLite
// ---------------------------------------------------------------------------

#[derive(sqlx::FromRow)]
struct CourseRow {
    id: String,
    name: String,
    description: Option<String>,
    color_from: Option<String>,
    color_to: Option<String>,
    status: String,
    created_at: i64,
    updated_at: i64,
}

impl CourseRow {
    fn into_data(self, tags: Vec<String>) -> CourseData {
        CourseData {
            id: self.id,
            name: self.name,
            description: self.description,
            tags,
            color_from: self.color_from,
            color_to: self.color_to,
            status: self.status,
            created_at: self.created_at,
            updated_at: self.updated_at,
        }
    }
}
