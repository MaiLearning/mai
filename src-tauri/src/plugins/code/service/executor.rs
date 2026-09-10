//! Исполнение кода во внешнем рантайме: временный каталог, таймаут, каптура вывода.

use std::path::Path;
use std::process::Stdio;
use std::time::{Duration, Instant};

use tokio::io::AsyncReadExt;
use tokio::process::{ChildStderr, ChildStdout, Command};

use super::data::CodeRunResultData;
use super::exceptions::CodeServiceError;

/// Таймаут исполнения — 10 секунд.
const RUN_TIMEOUT: Duration = Duration::from_secs(10);

/// Лимит каптуры stdout/stderr — 64 KB каждый (сверх лимита читается и отбрасывается).
const MAX_OUTPUT_BYTES: usize = 64 * 1024;

/// Записать `code` во временный каталог и исполнить через `runtime_path`.
pub async fn run(
    language: &str,
    code: &str,
    runtime_path: &str,
) -> Result<CodeRunResultData, CodeServiceError> {
    let dir = std::env::temp_dir().join(format!("mai-code-{}", uuid::Uuid::new_v4()));
    std::fs::create_dir_all(&dir).map_err(|e| {
        CodeServiceError::Internal(format!("Не удалось создать временный каталог: {}", e))
    })?;

    let result = run_in_dir(&dir, language, code, runtime_path).await;

    // Очистка временного каталога — best-effort.
    let _ = std::fs::remove_dir_all(&dir);

    result
}

async fn run_in_dir(
    dir: &Path,
    language: &str,
    code: &str,
    runtime_path: &str,
) -> Result<CodeRunResultData, CodeServiceError> {
    let file_path = dir.join(source_file_name(language));
    std::fs::write(&file_path, code).map_err(|e| {
        CodeServiceError::Internal(format!("Не удалось записать файл программы: {}", e))
    })?;

    let started = Instant::now();

    let mut child = Command::new(runtime_path)
        .arg(&file_path)
        .current_dir(dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()
        .map_err(|e| {
            CodeServiceError::Runtime(format!(
                "Не удалось запустить рантайм '{}': {}",
                runtime_path, e
            ))
        })?;

    // Пайпы забираем до wait, читаем параллельно — иначе процесс может
    // заблокироваться на переполненном пайпе.
    let stdout_pipe: ChildStdout = child.stdout.take().expect("stdout должен быть piped");
    let stderr_pipe: ChildStderr = child.stderr.take().expect("stderr должен быть piped");
    let stdout_task = tokio::spawn(read_capped(stdout_pipe));
    let stderr_task = tokio::spawn(read_capped(stderr_pipe));

    let waited = tokio::time::timeout(RUN_TIMEOUT, child.wait()).await;

    let timed_out = waited.is_err();
    if timed_out {
        // Завершаем процесс и дожидаемся, чтобы не оставить зомби.
        let _ = child.start_kill();
        let _ = child.wait().await;
    }

    // None при таймауте или сигнале (wait вернул ошибку).
    let exit_code = match waited {
        Ok(Ok(status)) => status.code(),
        _ => None,
    };

    let stdout = join_capture(stdout_task).await?;
    let stderr = join_capture(stderr_task).await?;

    Ok(CodeRunResultData {
        stdout,
        stderr,
        exit_code,
        timed_out,
        duration_ms: started.elapsed().as_millis() as i64,
    })
}

/// Имя файла с программой для языка (язык уже валидирован).
fn source_file_name(language: &str) -> &'static str {
    match language {
        "javascript" => "main.js",
        _ => "main.py",
    }
}

/// Дождаться задачи каптуры; ошибка чтения не проваливает запуск.
async fn join_capture(task: tokio::task::JoinHandle<String>) -> Result<String, CodeServiceError> {
    task.await
        .map_err(|e| CodeServiceError::Internal(format!("Задача каптуры вывода упала: {}", e)))
}

/// Читать поток до EOF, сохраняя не более MAX_OUTPUT_BYTES байт.
/// Сверх лимита данные продолжают читаться и отбрасываться,
/// чтобы процесс не блокировался на переполненном пайпе.
async fn read_capped<R: tokio::io::AsyncRead + Unpin>(mut reader: R) -> String {
    let mut buf: Vec<u8> = Vec::new();
    let mut chunk = [0u8; 8192];

    loop {
        match reader.read(&mut chunk).await {
            Ok(0) => break,
            Ok(n) => {
                let take = n.min(MAX_OUTPUT_BYTES.saturating_sub(buf.len()));
                buf.extend_from_slice(&chunk[..take]);
            }
            Err(e) => {
                log::warn!("Ошибка чтения вывода процесса: {}", e);
                break;
            }
        }
    }

    String::from_utf8_lossy(&buf).into_owned()
}
