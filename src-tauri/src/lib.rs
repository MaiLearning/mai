// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub mod client;
pub mod database;
pub mod plugins;
pub mod server;
pub mod services;
pub mod startup;
pub mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::Manager;
    let builder = tauri::Builder::default();

    #[cfg(feature = "pilot")]
    let builder = builder.plugin(tauri_plugin_pilot::init());

    builder
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .targets([
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Stdout),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::LogDir {
                        file_name: None,
                    }),
                    tauri_plugin_log::Target::new(tauri_plugin_log::TargetKind::Webview),
                ])
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            let app_paths = utils::paths::AppPaths::new(&app_handle)
                .expect("Failed to resolve app data directories");

            #[cfg(debug_assertions)]
            let db_config =
                database::sqlite::settings::DatabaseConfig::for_dev(app_paths.app_data_dir());
            #[cfg(not(debug_assertions))]
            let db_config =
                database::sqlite::settings::DatabaseConfig::for_prod(app_paths.app_data_dir());

            let pool = tauri::async_runtime::block_on(async {
                startup::init(
                    db_config,
                    app_paths.clone(),
                    startup::ServerConfig::default(),
                    app_handle.clone(),
                )
                .await
            });

            app.manage(pool);
            app.manage(app_paths);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            client::command::health::health,
            client::command::course::all_courses,
            client::command::course::all_tags,
            client::command::course::create_course,
            client::command::kv::kv_set,
            client::command::kv::kv_get,
            client::command::kv::kv_delete,
            client::command::kv::kv_exists,
            client::command::kv::kv_list_keys,
            client::command::course::get_course,
            client::command::course::update_course,
            client::command::course::delete_course,
            client::command::plugin::list_plugins,
            client::command::plugin::get_plugin,
            client::command::plugin::register_plugin,
            client::command::plugin::register_internal_plugin,
            client::command::plugin::remove_plugin,
            client::command::plugin::set_plugin_enabled,
            client::command::plugin::get_plugin_code,
            client::command::plugin::get_plugin_manifest,
            client::command::resource_type::list_resource_types,
            client::command::resource_type::create_resource_type,
            client::command::resource::create_resource,
            client::command::resource::update_resource,
            client::command::structure::get_structure,
            client::command::structure::create_directory,
            client::command::structure::delete_node,
            client::command::structure::rename_directory,
            client::command::structure::move_node,
            client::command::structure::get_directories,
            plugins::theory::client::commands::get_theory_content,
            plugins::theory::client::commands::save_theory_content,
            plugins::theory::client::commands::clear_theory_content,
            plugins::theory::client::commands::delete_theory_content,
            plugins::task::client::commands::task_snapshot,
            plugins::task::client::commands::create_task,
            plugins::task::client::commands::update_task_content,
            plugins::task::client::commands::update_task_difficulty,
            plugins::task::client::commands::delete_task,
            plugins::task::client::commands::set_task_difficulties,
            plugins::task::client::commands::submit_task_answer,
            plugins::task::client::commands::set_task_result,
            plugins::task::client::commands::restart_task,
            plugins::task::client::commands::list_task_attempts,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
