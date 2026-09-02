use tauri::AppHandle;
/// Запуск HTTP-сервера.
///
/// 1. Перебирает порты начиная с `start_port`, пока не найдёт свободный.
/// 2. Печатает URL сервера и Swagger-документации.
/// 3. Запускает axum с graceful shutdown (Ctrl+C / SIGTERM).
/// 4. При остановке печатает сообщение о завершении.
use tokio::net::TcpListener;

use super::router;
use super::state::AppState;
use crate::services::events::SharedChangePublisher;
use crate::utils::paths::AppPaths;
use sqlx::SqlitePool;

pub async fn run(
    pool: SqlitePool,
    app_paths: AppPaths,
    start_port: u16,
    app_handle: AppHandle,
    publisher: SharedChangePublisher,
) {
    let (listener, addr) = bind_available(start_port).await;

    println!("  ➜  HTTP:       http://{}", addr);
    println!("  ➜  API docs:  http://{}/docs", addr);

    let state = AppState {
        pool,
        app_paths,
        publisher,
    };

    axum::serve(listener, router::router(state))
        .with_graceful_shutdown(shutdown_signal(app_handle))
        .await
        .expect("server error");

    println!("  ✔  HTTP server stopped (http://{})", addr);
}

/// Перебирает порты начиная с `start_port`, возвращает первый свободный.
async fn bind_available(start_port: u16) -> (TcpListener, String) {
    for port in start_port..=u16::MAX {
        let addr = format!("127.0.0.1:{}", port);
        match TcpListener::bind(&addr).await {
            Ok(listener) => return (listener, addr),
            Err(_) if port < u16::MAX => continue,
            Err(e) => {
                panic!(
                    "failed to bind any port starting from {}: {}",
                    start_port, e
                );
            }
        }
    }
    unreachable!()
}

/// Ожидание сигнала завершения.
/// Либо SIGINT (Ctrl+C), либо SIGTERM.
async fn shutdown_signal(app_handle: AppHandle) {
    #[cfg(unix)]
    {
        let ctrl_c = tokio::signal::ctrl_c();
        let mut term = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to register SIGTERM handler");

        tokio::select! {
            _ = ctrl_c => {
                app_handle.exit(0);
            },
            _ = term.recv() => {
                app_handle.exit(0);
            },
        }
    }

    #[cfg(not(unix))]
    {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to listen for Ctrl+C");
        app_handle.exit(0);
    }
}
