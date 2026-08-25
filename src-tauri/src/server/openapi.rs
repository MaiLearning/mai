use utoipa::OpenApi;

use super::endpoints::{
    course, health, plugin, resource, resource_type,
    structure::{self, directory, move_node},
};

#[derive(OpenApi)]
#[openapi(
    info(title = "Mai Backend API", version = "0.1.0"),
    paths(
        health::health,
        // Courses
        course::all::handler,
        course::tags::handler,
        course::create::handler,
        course::get::handler,
        course::update::handler,
        course::delete::handler,
        // Structures
        structure::get_by_course::handler,
        structure::get_by_resource::handler,
        move_node::handler,
        directory::create::handler,
        directory::list::handler,
        directory::get::handler,
        directory::rename::handler,
        directory::delete::handler,
        // Plugins
        plugin::all::handler,
        plugin::get::handler,
        plugin::register::handler,
        plugin::remove::handler,
        plugin::set_enabled::handler,
        // Resources
        resource::create::handler,
        resource::get::handler,
        resource::update::handler,
        resource::delete::handler,
        // Resource types
        resource_type::all::handler,
        resource_type::get::handler,
        resource_type::create::handler,
        resource_type::delete::handler,
    ),
    components(schemas(
        health::HealthResponse,
        // Courses
        crate::services::course::CourseData,
        crate::services::course::CourseTagStat,
        // Structures
        crate::services::structure::StructureNodeFlat,
        crate::services::structure::DirectoryData,
        structure::move_node::MoveNodeRequest,
        structure::move_node::MoveNodeResponse,
        structure::directory::create::CreateDirectoryRequest,
        structure::directory::list::ListDirectoriesQuery,
        structure::directory::rename::RenameDirectoryRequest,
        // Plugins
        crate::services::plugin::PluginData,
        crate::services::plugin::PluginKind,
        crate::services::plugin::PluginManifest,
        plugin::register::RegisterPluginRequest,
        plugin::set_enabled::SetPluginEnabledRequest,
        // Resources
        crate::services::resource::ResourceData,
        resource::create::CreateResourceRequest,
        resource::update::UpdateResourceRequest,
        // Resource types
        crate::services::resource::ResourceTypeData,
        resource_type::create::CreateResourceTypeRequest,
    )),
    tags(
        (name = "health", description = "Health check"),
        (name = "courses", description = "Course management"),
        (name = "structures", description = "Course structure management"),
        (name = "plugins", description = "Plugin management"),
        (name = "resources", description = "Resource management"),
        (name = "resource_types", description = "Resource type management"),
    )
)]
pub struct ApiDoc;
