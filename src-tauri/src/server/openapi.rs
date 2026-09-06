use utoipa::OpenApi;

use super::endpoints::{
    course, health, plugin, plugin_gateway, resource, resource_type,
    structure::{self, directory, move_node, node},
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
        node::rename::handler,
        directory::delete::handler,
        // Plugins
        plugin::all::handler,
        plugin::get::handler,
        plugin::register::handler,
        plugin::remove::handler,
        plugin::set_enabled::handler,
        // Plugin gateway bridge
        plugin_gateway::manifests::handler,
        plugin_gateway::call::handler,
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
        structure::node::rename::RenameNodeRequest,
        // Plugins
        crate::services::plugin::PluginData,
        crate::services::plugin::PluginKind,
        crate::services::plugin::PluginManifest,
        plugin::register::RegisterPluginRequest,
        plugin::set_enabled::SetPluginEnabledRequest,
        // Plugin gateway bridge
        crate::plugins::gateway::data::GatewayManifest,
        crate::plugins::gateway::data::GatewayMethodInfo,
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
        (name = "plugin_gateway", description = "HTTP-мост над gateway плагинов: /plugin/manifests, /plugin/{plugin_id}/{method}"),
        (name = "resources", description = "Resource management"),
        (name = "resource_types", description = "Resource type management"),
    )
)]
pub struct ApiDoc;
