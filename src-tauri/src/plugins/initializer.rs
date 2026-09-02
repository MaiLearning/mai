use std::sync::Arc;

use sqlx::SqlitePool;

use crate::database::sqlite::repositories::plugin::SqlitePluginRepository;
use crate::database::sqlite::repositories::resource::SqliteResourceRepository;
use crate::database::sqlite::repositories::resource_type::SqliteResourceTypeRepository;
use crate::services::events::{ChangePublisher, EntityChanged};
use crate::services::plugin::PluginService;
use crate::services::resource::ResourceService;
use crate::utils::paths::AppPaths;

use super::registry::register_internal_plugins;

/// Заглушка паблишера: при старте слушателей ещё нет, события никуда не идут.
struct NoopPublisher;

impl ChangePublisher for NoopPublisher {
    fn publish(&self, _event: EntityChanged) {}
}

/// Инициализация internal-плагинов при старте приложения.
///
/// Читает реестр и для каждого плагина:
/// 1. Регистрирует в `plugins` + `internal_plugins` (если ещё нет)
/// 2. Создаёт типы ресурсов в `resource_types` (если ещё нет)
pub async fn initialize(pool: &SqlitePool, app_paths: &AppPaths) {
    let entries = register_internal_plugins();
    if entries.is_empty() {
        return;
    }

    let plugin_repo = Arc::new(SqlitePluginRepository::new(pool.clone()));
    let resource_repo = Arc::new(SqliteResourceRepository::new(pool.clone()));
    let resource_type_repo = Arc::new(SqliteResourceTypeRepository::new(pool.clone()));

    let publisher = Arc::new(NoopPublisher);
    let plugin_service = PluginService::new(app_paths.clone(), plugin_repo, publisher.clone());
    let resource_service = ResourceService::new(
        app_paths.clone(),
        resource_repo,
        resource_type_repo,
        publisher,
    );

    // Получаем существующие плагины и типы ресурсов
    let existing_plugins = match plugin_service.list().await {
        Ok(plugins) => plugins,
        Err(e) => {
            log::warn!("[InternalPlugin] Failed to fetch plugins: {}", e);
            return;
        }
    };

    let existing_types = match resource_service.list_types().await {
        Ok(types) => types,
        Err(e) => {
            log::warn!("[InternalPlugin] Failed to fetch resource types: {}", e);
            return;
        }
    };

    for entry in &entries {
        // Шаг 1: Регистрируем плагин
        if !existing_plugins.iter().any(|p| p.id == entry.id) {
            match plugin_service
                .add_internal(entry.id, entry.name, entry.version, entry.description, None)
                .await
            {
                Ok(_) => log::info!("[InternalPlugin] Registered plugin \"{}\"", entry.id),
                Err(e) => {
                    log::warn!(
                        "[InternalPlugin] Failed to register plugin \"{}\": {}",
                        entry.id,
                        e
                    );
                    continue;
                }
            }
        }

        // Шаг 2: Создаём или обновляем типы ресурсов
        for rt in &entry.resource_types {
            let existing = existing_types.iter().find(|t| t.key == rt.key);

            match existing {
                None => {
                    // Тип не существует — создаём
                    let mut rt_data = rt.clone();
                    rt_data.plugin_id = Some(entry.id.to_string());

                    match resource_service.create_type(rt_data).await {
                        Ok(_) => {
                            log::info!("[InternalPlugin] Created resource type \"{}\"", rt.key)
                        }
                        Err(e) => {
                            log::warn!(
                                "[InternalPlugin] Failed to create resource type \"{}\": {}",
                                rt.key,
                                e
                            );
                        }
                    }
                }
                Some(existing_type) if existing_type.plugin_id.is_none() => {
                    // Тип существует, но без plugin_id — обновляем
                    let mut rt_data = existing_type.clone();
                    rt_data.plugin_id = Some(entry.id.to_string());

                    match resource_service.update_type(rt_data).await {
                        Ok(_) => log::info!(
                            "[InternalPlugin] Updated plugin_id for resource type \"{}\"",
                            rt.key
                        ),
                        Err(e) => {
                            log::warn!(
                                "[InternalPlugin] Failed to update resource type \"{}\": {}",
                                rt.key,
                                e
                            );
                        }
                    }
                }
                _ => {
                    // Тип существует и уже имеет plugin_id — пропускаем
                }
            }
        }
    }
}
