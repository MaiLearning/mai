// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::path::PathBuf;

pub mod client;
pub mod database;
pub mod plugins;
pub mod server;
pub mod services;
pub mod startup;
pub mod utils;

fn resolve_config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    use tauri::Manager;

    let mut candidates = Vec::new();

    if let Ok(resource_dir) = app.path().resource_dir() {
        candidates.push(resource_dir.join("mai.toml"));
    }

    // `tauri dev --release` не собирает ресурсы, поэтому используем исходный
    // конфиг как fallback для release-сборки в режиме разработки.
    candidates.push(
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .map(|dir| dir.join("mai.toml"))
            .ok_or_else(|| "mai.toml: не удалось определить корень проекта".to_owned())?,
    );

    candidates
        .iter()
        .find(|path| path.is_file())
        .cloned()
        .ok_or_else(|| {
            let checked_paths = candidates
                .iter()
                .map(|path| path.display().to_string())
                .collect::<Vec<_>>()
                .join(", ");
            format!("mai.toml не найден по путям: {checked_paths}")
        })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    use tauri::Emitter;
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
            use std::sync::Arc;

            use crate::services::events::ChangeOrigin;

            let app_handle = app.handle().clone();

            let app_paths = utils::paths::AppPaths::new(&app_handle)
                .expect("Failed to resolve app data directories");

            // Единый конфиг проекта (mai.toml): читается фронтом через
            // config_get, изменения приходят событием config://changed.
            // Путь не зависит от рабочего каталога процесса (CWD dev-запуска
            // может отличаться) — см. SPEC @mai/config.
            let config_path =
                resolve_config_path(&app_handle).expect("Не удалось найти конфигурацию mai.toml");
            let app_config = Arc::new(
                mai_config::MaiConfig::load(config_path.clone()).unwrap_or_else(|e| {
                    panic!(
                        "Failed to load mai.toml configuration at {:?}: {}",
                        config_path, e
                    )
                }),
            );
            let emit_handle = app_handle.clone();
            let config_watcher = app_config
                .watch(move |value| {
                    let _ = emit_handle.emit("config://changed", value);
                })
                .expect("Failed to watch mai.toml");
            app.manage(app_config);
            app.manage(config_watcher);

            #[cfg(debug_assertions)]
            let db_config =
                database::sqlite::settings::DatabaseConfig::for_dev(app_paths.app_data_dir());
            #[cfg(not(debug_assertions))]
            let db_config =
                database::sqlite::settings::DatabaseConfig::for_prod(app_paths.app_data_dir());

            let publishers = crate::utils::events::ChangePublishers {
                ipc: Arc::new(crate::utils::events::TauriChangePublisher::new(
                    app_handle.clone(),
                    ChangeOrigin::Ipc,
                )),
                http: Arc::new(crate::utils::events::TauriChangePublisher::new(
                    app_handle.clone(),
                    ChangeOrigin::Http,
                )),
            };
            let http_publisher = publishers.http.clone();
            app.manage(publishers);

            let pool = tauri::async_runtime::block_on(async {
                startup::init(
                    db_config,
                    app_paths.clone(),
                    startup::ServerConfig::default(),
                    app_handle.clone(),
                    http_publisher,
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
            client::command::structure::rename_node,
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
            plugins::code::client::commands::code_snapshot,
            plugins::code::client::commands::update_code_content,
            plugins::code::client::commands::code_run,
            plugins::gateway::commands::plugin_gateway_call,
            plugins::gateway::commands::plugin_gateway_manifests,
            plugins::link::client::commands::list_links,
            plugins::link::client::commands::list_backlinks,
            plugins::link::client::commands::list_course_links,
            plugins::link::client::commands::create_link,
            plugins::link::client::commands::update_link,
            plugins::link::client::commands::delete_link,
            mai_config::commands::config_get,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
