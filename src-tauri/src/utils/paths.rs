use std::fmt;
use std::path::{Path, PathBuf};

use tauri::Manager;

// ---------------------------------------------------------------------------
// Ошибки модуля путей
// ---------------------------------------------------------------------------

/// Курс не найден в файловой системе.
#[derive(Debug, Clone)]
pub struct CourseNotFoundException {
    pub course_id: String,
}

impl CourseNotFoundException {
    pub fn new(course_id: impl Into<String>) -> Self {
        Self {
            course_id: course_id.into(),
        }
    }
}

impl fmt::Display for CourseNotFoundException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Course not found: {}", self.course_id)
    }
}

/// Плагин не найден в файловой системе.
#[derive(Debug, Clone)]
pub struct PluginNotFoundException {
    pub plugin_id: String,
}

impl PluginNotFoundException {
    pub fn new(plugin_id: impl Into<String>) -> Self {
        Self {
            plugin_id: plugin_id.into(),
        }
    }
}

impl fmt::Display for PluginNotFoundException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Plugin not found: {}", self.plugin_id)
    }
}

/// Ресурс курса не найден в файловой системе.
#[derive(Debug, Clone)]
pub struct ResourceNotFoundException {
    pub course_id: String,
    pub resource_id: String,
}

impl ResourceNotFoundException {
    pub fn new(course_id: impl Into<String>, resource_id: impl Into<String>) -> Self {
        Self {
            course_id: course_id.into(),
            resource_id: resource_id.into(),
        }
    }
}

impl fmt::Display for ResourceNotFoundException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Resource not found: course={}, resource={}",
            self.course_id, self.resource_id
        )
    }
}

// ---------------------------------------------------------------------------
// Ошибки файловых операций
// ---------------------------------------------------------------------------

/// Ошибка файловой операции.
#[derive(Debug)]
pub enum FsError {
    Io(std::io::Error),
    NotFound(String),
    AlreadyExists(String),
}

impl fmt::Display for FsError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Io(e) => write!(f, "IO error: {}", e),
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::AlreadyExists(msg) => write!(f, "Already exists: {}", msg),
        }
    }
}

impl std::error::Error for FsError {}

impl From<std::io::Error> for FsError {
    fn from(e: std::io::Error) -> Self {
        match e.kind() {
            std::io::ErrorKind::NotFound => Self::NotFound(e.to_string()),
            std::io::ErrorKind::AlreadyExists => Self::AlreadyExists(e.to_string()),
            _ => Self::Io(e),
        }
    }
}

// ---------------------------------------------------------------------------
// Resolver путей
// ---------------------------------------------------------------------------

/// Resolver путей приложения.
///
/// Создаётся один раз через [`AppPaths::new`] и хранит пути в кешированном виде.
/// Предоставляет единую точку для разрешения путей в файловой системе,
/// абстрагируясь от Tauri path API и конкретной ОС.
#[derive(Clone, Debug)]
pub struct AppPaths {
    /// Корневая директория приложения (Tauri `app_data_dir`).
    pub app_data_dir: PathBuf,
    /// Директория хранения данных: `{app_data_dir}/storage/`.
    pub storage_dir: PathBuf,
    /// Корень директории плагинов: `{app_data_dir}/plugins/`.
    pub plugins_dir: PathBuf,
    /// Корень директории курсов: `{app_data_dir}/courses/`.
    pub courses_dir: PathBuf,
}

impl AppPaths {
    /// Создаёт `AppPaths`, разрешая пути через Tauri `AppHandle`.
    pub fn new(app_handle: &tauri::AppHandle) -> Result<Self, tauri::Error> {
        let app_data_dir = app_handle.path().app_data_dir()?;
        let storage_dir = app_data_dir.join("storage");
        let plugins_dir = app_data_dir.join("plugins");
        let courses_dir = app_data_dir.join("courses");

        Ok(Self {
            app_data_dir,
            storage_dir,
            plugins_dir,
            courses_dir,
        })
    }

    // -- Базовые пути (без проверки) ----------------------------------------

    pub fn app_data_dir(&self) -> &Path {
        &self.app_data_dir
    }

    pub fn storage_dir(&self) -> &Path {
        &self.storage_dir
    }

    pub fn plugins_dir(&self) -> &Path {
        &self.plugins_dir
    }

    pub fn courses_dir(&self) -> &Path {
        &self.courses_dir
    }

    /// Путь к файлу базы данных: `{storage_dir}/mai.db`.
    pub fn db_path(&self) -> PathBuf {
        self.storage_dir.join("mai.db")
    }

    pub fn plugin_path(&self, plugin_id: &str) -> PathBuf {
        self.plugins_dir.join(plugin_id)
    }

    pub fn plugin_code_path(&self, plugin_id: &str) -> PathBuf {
        self.plugin_path(plugin_id).join("index.js")
    }

    pub fn plugin_manifest_path(&self, plugin_id: &str) -> PathBuf {
        self.plugin_path(plugin_id).join("manifest.json")
    }

    pub fn plugin_db_path(&self, plugin_id: &str) -> PathBuf {
        self.plugin_path(plugin_id).join("data.db")
    }

    pub fn course_path(&self, course_id: &str) -> PathBuf {
        self.courses_dir.join(course_id)
    }

    pub fn course_resources_path(&self, course_id: &str) -> PathBuf {
        self.course_path(course_id).join("resources")
    }

    pub fn course_resource_path(&self, course_id: &str, resource_id: &str) -> PathBuf {
        self.course_resources_path(course_id).join(resource_id)
    }

    // -- Проверка существования ---------------------------------------------

    pub fn plugin_dir(&self, plugin_id: &str) -> Result<PathBuf, PluginNotFoundException> {
        let dir = self.plugin_path(plugin_id);
        if dir.exists() {
            Ok(dir)
        } else {
            Err(PluginNotFoundException::new(plugin_id))
        }
    }

    pub fn course_dir(&self, course_id: &str) -> Result<PathBuf, CourseNotFoundException> {
        let dir = self.course_path(course_id);
        if dir.exists() {
            Ok(dir)
        } else {
            Err(CourseNotFoundException::new(course_id))
        }
    }

    pub fn course_resources_dir(
        &self,
        course_id: &str,
    ) -> Result<PathBuf, CourseNotFoundException> {
        self.course_dir(course_id)?;
        Ok(self.course_resources_path(course_id))
    }

    pub fn course_resource_dir(
        &self,
        course_id: &str,
        resource_id: &str,
    ) -> Result<PathBuf, ResourceNotFoundException> {
        let dir = self.course_resource_path(course_id, resource_id);
        if dir.exists() {
            Ok(dir)
        } else {
            Err(ResourceNotFoundException::new(course_id, resource_id))
        }
    }

    // -- Файловые операции: плагины ----------------------------------------

    /// Создать директорию плагина (идемпотентно).
    pub fn create_plugin_dir(&self, plugin_id: &str) -> Result<(), FsError> {
        std::fs::create_dir_all(self.plugin_path(plugin_id))?;
        Ok(())
    }

    /// Записать JS-код плагина в index.js.
    pub fn write_plugin_code(&self, plugin_id: &str, code: &str) -> Result<(), FsError> {
        std::fs::write(self.plugin_code_path(plugin_id), code)?;
        Ok(())
    }

    /// Записать манифест плагина в manifest.json.
    pub fn write_plugin_manifest(
        &self,
        plugin_id: &str,
        manifest_json: &str,
    ) -> Result<(), FsError> {
        std::fs::write(self.plugin_manifest_path(plugin_id), manifest_json)?;
        Ok(())
    }

    /// Прочитать JS-код плагина из index.js.
    pub fn read_plugin_code(&self, plugin_id: &str) -> Result<String, FsError> {
        let path = self.plugin_code_path(plugin_id);
        if !path.exists() {
            return Err(FsError::NotFound(format!(
                "Plugin code not found: {}",
                plugin_id
            )));
        }
        Ok(std::fs::read_to_string(path)?)
    }

    /// Прочитать манифест плагина из manifest.json.
    pub fn read_plugin_manifest(&self, plugin_id: &str) -> Result<String, FsError> {
        let path = self.plugin_manifest_path(plugin_id);
        if !path.exists() {
            return Err(FsError::NotFound(format!(
                "Plugin manifest not found: {}",
                plugin_id
            )));
        }
        Ok(std::fs::read_to_string(path)?)
    }

    /// Удалить директорию плагина рекурсивно.
    pub fn remove_plugin_dir(&self, plugin_id: &str) -> Result<(), FsError> {
        let dir = self.plugin_path(plugin_id);
        if !dir.exists() {
            return Ok(());
        }
        std::fs::remove_dir_all(dir)?;
        Ok(())
    }

    // -- Файловые операции: курсы -------------------------------------------

    /// Создать директорию курса (идемпотентно).
    pub fn create_course_dir(&self, course_id: &str) -> Result<(), FsError> {
        std::fs::create_dir_all(self.course_path(course_id))?;
        Ok(())
    }

    /// Создать поддиректорию resources/ внутри курса (идемпотентно).
    pub fn create_course_resources_dir(&self, course_id: &str) -> Result<(), FsError> {
        std::fs::create_dir_all(self.course_resources_path(course_id))?;
        Ok(())
    }

    /// Удалить директорию курса рекурсивно.
    pub fn remove_course_dir(&self, course_id: &str) -> Result<(), FsError> {
        let dir = self.course_path(course_id);
        if !dir.exists() {
            return Ok(());
        }
        std::fs::remove_dir_all(dir)?;
        Ok(())
    }

    // -- Файловые операции: ресурсы -----------------------------------------

    /// Создать директорию ресурса внутри курса (идемпотентно).
    pub fn create_resource_dir(&self, course_id: &str, resource_id: &str) -> Result<(), FsError> {
        std::fs::create_dir_all(self.course_resource_path(course_id, resource_id))?;
        Ok(())
    }

    /// Удалить директорию ресурса рекурсивно.
    pub fn remove_resource_dir(&self, course_id: &str, resource_id: &str) -> Result<(), FsError> {
        let dir = self.course_resource_path(course_id, resource_id);
        if !dir.exists() {
            return Ok(());
        }
        std::fs::remove_dir_all(dir)?;
        Ok(())
    }
}
