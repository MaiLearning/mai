//! `mai_list_courses` — список курсов кратко.

use std::sync::Arc;

use rmcp::model::CallToolResult;
use rmcp::ErrorData;

use crate::database::sqlite::repositories::course::SqliteCourseRepository;
use crate::server::state::AppState;
use crate::services::course::CourseService;

use super::super::dto::CourseBrief;
use super::super::render;

pub const NAME: &str = "mai_list_courses";

pub async fn run(state: &AppState) -> Result<CallToolResult, ErrorData> {
    let repo = Arc::new(SqliteCourseRepository::new(state.pool.clone()));
    let service = CourseService::new(state.app_paths.clone(), repo, state.publisher.clone());

    match service.all().await {
        Ok(courses) => {
            let briefs: Vec<CourseBrief> = courses.into_iter().map(CourseBrief::from).collect();
            render::json(NAME, &briefs)
        }
        Err(e) => render::tool_error(NAME, e),
    }
}
