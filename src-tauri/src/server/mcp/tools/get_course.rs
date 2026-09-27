//! `mai_get_course` — карточка одного курса.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::server::state::AppState;
use crate::services::course::CourseService;

use super::super::dto::CourseBrief;
use super::super::render;
use super::args::CourseIdArgs;

pub const NAME: &str = "mai_get_course";

pub async fn run(state: &AppState, args: CourseIdArgs) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqliteCourseRepository::new(state.pool.clone()));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());

    match service.get(&args.course_id).await {
        Ok(course) => render::json(NAME, &CourseBrief::from(course)),
        Err(e) => render::tool_error(NAME, e),
    }
}
