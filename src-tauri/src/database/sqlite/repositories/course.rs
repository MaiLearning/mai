// SQLite-реализация CourseRepository.

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
            "SELECT id, name, description, topic, color_from, color_to, status, created_at, updated_at \
             FROM courses ORDER BY name",
        )
        .fetch_all(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        Ok(rows.into_iter().map(|r| r.into()).collect())
    }

    async fn get_course(&self, id: &str) -> RepoResult<CourseData> {
        let row = sqlx::query_as::<_, CourseRow>(
            "SELECT id, name, description, topic, color_from, color_to, status, created_at, updated_at \
             FROM courses WHERE id = ?",
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(RepoError::Db)?
        .ok_or_else(|| RepoError::NotFound(format!("Course '{}' not found", id)))?;

        Ok(row.into())
    }

    async fn create_course(&self, data: CourseData) -> RepoResult<CourseData> {
        let result = sqlx::query(
            "INSERT INTO courses (id, name, description, topic, color_from, color_to, status, created_at, updated_at) \
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(&data.id)
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.topic)
        .bind(&data.color_from)
        .bind(&data.color_to)
        .bind(&data.status)
        .bind(data.created_at)
        .bind(data.updated_at)
        .execute(&self.pool)
        .await;

        match result {
            Ok(_) => Ok(data),
            Err(sqlx::Error::Database(db_err)) if db_err.is_unique_violation() => Err(
                RepoError::Conflict(format!("Course with id '{}' already exists", data.id)),
            ),
            Err(e) => Err(RepoError::Db(e)),
        }
    }

    async fn update_course(&self, data: CourseData) -> RepoResult<CourseData> {
        let result = sqlx::query(
            "UPDATE courses SET name = ?, description = ?, topic = ?, color_from = ?, color_to = ?, status = ?, \
             created_at = ?, updated_at = ? WHERE id = ?",
        )
        .bind(&data.name)
        .bind(&data.description)
        .bind(&data.topic)
        .bind(&data.color_from)
        .bind(&data.color_to)
        .bind(&data.status)
        .bind(data.created_at)
        .bind(data.updated_at)
        .bind(&data.id)
        .execute(&self.pool)
        .await
        .map_err(RepoError::Db)?;

        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Course '{}' not found",
                data.id
            )));
        }

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

// ---------------------------------------------------------------------------
// Внутренняя строка для загрузки из SQLite
// ---------------------------------------------------------------------------

#[derive(sqlx::FromRow)]
struct CourseRow {
    id: String,
    name: String,
    description: Option<String>,
    topic: Option<String>,
    color_from: Option<String>,
    color_to: Option<String>,
    status: String,
    created_at: i64,
    updated_at: i64,
}

impl From<CourseRow> for CourseData {
    fn from(r: CourseRow) -> Self {
        CourseData {
            id: r.id,
            name: r.name,
            description: r.description,
            topic: r.topic,
            color_from: r.color_from,
            color_to: r.color_to,
            status: r.status,
            created_at: r.created_at,
            updated_at: r.updated_at,
        }
    }
}
