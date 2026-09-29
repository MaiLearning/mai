//! Исполнение кода во внешнем рантайме: временный каталог, таймаут, каптура вывода.
//!
//! Python/JavaScript — рантайм-путь указывает на интерпретатор, который сразу
//! исполняет файл программы. Rust — двухстадийный пайплайн: `runtime_path`
//! указывает на компилятор `rustc`, который собирает файл в бинарник во временном
//! каталоге, после чего бинарник запускается. Ошибка/таймаут компиляции завершают
//! запуск без второй стадии; диагностика компилятора (ошибки и warnings) идёт
//! в stderr результата — на успехе она склеивается со stderr самой программы.

use std::path::{Path, PathBuf};
use std::process::Stdio;
use std::time::{Duration, Instant};

use tokio::io::AsyncReadExt;
use tokio::process::{ChildStderr, ChildStdout, Command};

use super::data::CodeRunResultData;
use super::exceptions::CodeServiceError;

/// Таймаут одной стадии исполнения (компиляция или запуск) — 10 секунд.
const RUN_TIMEOUT: Duration = Duration::from_secs(10);

/// Лимит каптуры stdout/stderr — 64 KB каждый (сверх лимита читается и отбрасывается).
const MAX_OUTPUT_BYTES: usize = 64 * 1024;

/// Edition, с которым компилируются уроки на Rust (без него `rustc` берёт
/// устаревший edition 2015 по умолчанию).
const RUST_EDITION: &str = "2021";

/// Результат одной стадии исполнения (компиляция или запуск процесса).
struct StageOutput {
    stdout: String,
    stderr: String,
    /// None — процесс убит по таймауту или завершился по сигналу.
    exit_code: Option<i32>,
    timed_out: bool,
}

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

    if language == "rust" {
        return run_rust(dir, &file_path, runtime_path, started).await;
    }

    let cmd = {
        let mut cmd = Command::new(runtime_path);
        cmd.arg(&file_path).current_dir(dir);
        cmd
    };
    let stage = run_stage(cmd, runtime_path, RUN_TIMEOUT).await?;

    Ok(CodeRunResultData {
        stdout: stage.stdout,
        stderr: stage.stderr,
        exit_code: stage.exit_code,
        timed_out: stage.timed_out,
        duration_ms: started.elapsed().as_millis() as i64,
    })
}

/// Имя файла с программой для языка (язык уже валидирован).
fn source_file_name(language: &str) -> &'static str {
    match language {
        "javascript" => "main.js",
        "rust" => "main.rs",
        _ => "main.py",
    }
}

/// Имя скомпилированного бинарника Rust-урока во временном каталоге.
fn binary_name() -> &'static str {
    if cfg!(windows) {
        "main.exe"
    } else {
        "main"
    }
}

/// Компиляция `file_path` компилятором `rustc` (`runtime_path`) и запуск
/// полученного бинарника. Ошибка/таймаут компиляции возвращаются как результат
/// запуска (её вывод — вердикт «код не работает», не ошибка сервиса); на успехе
/// stderr компилятора (warnings) склеивается со stderr программы.
async fn run_rust(
    dir: &Path,
    file_path: &Path,
    runtime_path: &str,
    started: Instant,
) -> Result<CodeRunResultData, CodeServiceError> {
    let binary_path: PathBuf = dir.join(binary_name());

    let compile_cmd = {
        let mut cmd = Command::new(runtime_path);
        cmd.arg(file_path)
            .arg("--edition")
            .arg(RUST_EDITION)
            .arg("-o")
            .arg(&binary_path)
            .current_dir(dir);
        cmd
    };
    let compiled = run_stage(compile_cmd, runtime_path, RUN_TIMEOUT).await?;

    if compiled.timed_out || compiled.exit_code != Some(0) {
        return Ok(CodeRunResultData {
            stdout: compiled.stdout,
            stderr: compiled.stderr,
            exit_code: compiled.exit_code,
            timed_out: compiled.timed_out,
            duration_ms: started.elapsed().as_millis() as i64,
        });
    }

    let run_cmd = {
        let mut cmd = Command::new(&binary_path);
        cmd.current_dir(dir);
        cmd
    };
    let label = binary_path.to_string_lossy().into_owned();
    let ran = run_stage(run_cmd, &label, RUN_TIMEOUT).await?;

    Ok(CodeRunResultData {
        stdout: ran.stdout,
        stderr: format!("{}{}", compiled.stderr, ran.stderr),
        exit_code: ran.exit_code,
        timed_out: ran.timed_out,
        duration_ms: started.elapsed().as_millis() as i64,
    })
}

/// Запуск одного процесса с таймаутом и каптурой stdout/stderr.
async fn run_stage(
    mut cmd: Command,
    program_label: &str,
    timeout: Duration,
) -> Result<StageOutput, CodeServiceError> {
    let mut child = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()
        .map_err(|e| {
            CodeServiceError::Runtime(format!(
                "Не удалось запустить рантайм '{}': {}",
                program_label, e
            ))
        })?;

    // Пайпы забираем до wait, читаем параллельно — иначе процесс может
    // заблокироваться на переполненном пайпе.
    let stdout_pipe: ChildStdout = child.stdout.take().expect("stdout должен быть piped");
    let stderr_pipe: ChildStderr = child.stderr.take().expect("stderr должен быть piped");
    let stdout_task = tokio::spawn(read_capped(stdout_pipe));
    let stderr_task = tokio::spawn(read_capped(stderr_pipe));

    let waited = tokio::time::timeout(timeout, child.wait()).await;

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

    Ok(StageOutput {
        stdout,
        stderr,
        exit_code,
        timed_out,
    })
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

#[cfg(test)]
mod tests {
    use super::{binary_name, run, source_file_name};

    #[test]
    fn source_file_name_matches_language() {
        assert_eq!(source_file_name("python"), "main.py");
        assert_eq!(source_file_name("javascript"), "main.js");
        assert_eq!(source_file_name("rust"), "main.rs");
    }

    #[test]
    fn binary_name_matches_platform() {
        let expected = if cfg!(windows) { "main.exe" } else { "main" };
        assert_eq!(binary_name(), expected);
    }

    /// Есть ли `rustc` в PATH — тест ниже пропускается без него, чтобы не
    /// требовать установленный Rust-тулчейн для прогона остального пакета.
    fn rustc_available() -> bool {
        std::process::Command::new("rustc")
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false)
    }

    #[tokio::test]
    async fn compiles_and_runs_rust_program() {
        if !rustc_available() {
            eprintln!("rustc не найден в PATH — тест пропущен");
            return;
        }

        let code = r#"fn main() { println!("hi"); }"#;
        let result = run("rust", code, "rustc")
            .await
            .expect("запуск не должен падать");

        assert_eq!(result.exit_code, Some(0));
        assert!(!result.timed_out);
        assert_eq!(result.stdout.trim(), "hi");
    }

    #[tokio::test]
    async fn reports_rust_compile_error_without_running() {
        if !rustc_available() {
            eprintln!("rustc не найден в PATH — тест пропущен");
            return;
        }

        // Синтаксическая ошибка: компиляция должна упасть до запуска бинарника.
        let code = "fn main() { let x = ; }";
        let result = run("rust", code, "rustc")
            .await
            .expect("запуск не должен падать");

        assert_ne!(result.exit_code, Some(0));
        assert!(!result.timed_out);
        assert!(!result.stderr.is_empty());
        assert_eq!(result.stdout, "");
    }
}
