/// Оркестрация запуска всех подсистем приложения.
///
/// # TODO: Постоянно работающее приложение
///
/// Текущий запуск сервера — временная заглушка.
/// В будущем систему нужно заменить на концепцию постоянно работающего
/// приложения (daemon / background service), которое остаётся доступным
/// по HTTP даже когда пользователь закрыл GUI.
///
/// Это необходимо для трёх сценариев:
///
/// 1. **Синхронизация между устройствами** — приложение выступает
///    локальным сервером, с которым могут синхронизироваться другие
///    инстансы (peer-to-peer или через центральный relay).
///
/// 2. **Интеллектуальные агенты** — AI-агенты взаимодействуют с курсом
///    через REST API независимо от того, открыто ли приложение
///    пользователем. Агент может создавать ресурсы, проверять задания,
///    анализировать прогресс и т.д.
///
/// 3. **Совместная работа (multi-user)** — несколько пользователей
///    работают в рамках одного курса одновременно. Сервер управляет
///    конкурентным доступом, блокировками и рассылкой изменений
///    (через WebSocket или Server-Sent Events).
use sqlx::SqlitePool;
use tauri::AppHandle;

use crate::database::sqlite::{Database, DatabaseConfig};
use crate::services::events::SharedChangePublisher;
use crate::utils::paths::AppPaths;

/// Конфигурация HTTP-сервера.
pub struct ServerConfig {
    /// Начальный порт для попытки привязки.
    /// Если занят — автоматически +1.
    pub start_port: u16,
}

impl Default for ServerConfig {
    fn default() -> Self {
        Self { start_port: 3000 }
    }
}

/// Инициализация всех подсистем приложения.
///
/// Последовательно вызывает инициализаторы 각ых подсистем
/// и возвращает `SqlitePool` для Tauri.
pub async fn init(
    db_config: DatabaseConfig,
    app_paths: AppPaths,
    server_config: ServerConfig,
    app_handle: AppHandle,
    publisher: SharedChangePublisher,
) -> SqlitePool {
    let pool = init_database(db_config).await;
    init_internal_plugins(&pool, &app_paths).await;
    init_http_server(&pool, &app_paths, server_config, app_handle, publisher).await;
    pool
}

/// Инициализация базы данных.
///
/// Создаёт файл БД (если не существует) и применяет все миграции
/// через refinery. Возвращает пул соединений для использования
/// всеми остальными подсистемами.
async fn init_database(db_config: DatabaseConfig) -> SqlitePool {
    let database = Database::new(db_config).await;
    database.pool
}

/// Регистрация internal-плагинов в базе данных.
///
/// Читает реестр internal-плагинов и для каждого:
/// 1. Создаёт запись в таблицах `plugins` + `internal_plugins` (если ещё нет)
/// 2. Создаёт соответствующие типы ресурсов в `resource_types` (если ещё нет)
///
/// Выполняется при старте приложения, до запуска HTTP-сервера.
async fn init_internal_plugins(pool: &SqlitePool, app_paths: &AppPaths) {
    crate::plugins::initializer::initialize(pool, app_paths).await;
}

/// Запуск HTTP-сервера в фоновом tokio-задании.
///
/// Сервер предоставляет REST API для взаимодействия с внешними
/// агентами и интеграциями. Работает независимо от GUI —
/// доступен даже при закрытом окне приложения (в будущем).
async fn init_http_server(
    pool: &SqlitePool,
    app_paths: &AppPaths,
    server_config: ServerConfig,
    app_handle: AppHandle,
    publisher: SharedChangePublisher,
) {
    let pool = pool.clone();
    let app_paths = app_paths.clone();
    tokio::spawn(async move {
        crate::server::run(
            pool,
            app_paths,
            server_config.start_port,
            app_handle,
            publisher,
        )
        .await;
    });
}
