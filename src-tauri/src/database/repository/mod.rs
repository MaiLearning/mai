pub mod course;
pub mod directory;
pub mod kv;
pub mod plugin;
pub mod resource;
pub mod resource_type;
pub mod structure;
pub mod task;
pub mod theory;

pub type RepoResult<T> = Result<T, RepoError>;

#[derive(Debug)]
pub enum RepoError {
    NotFound(String),
    Conflict(String),
    Db(sqlx::Error),
}

impl std::fmt::Display for RepoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NotFound(msg) => write!(f, "Not found: {}", msg),
            Self::Conflict(msg) => write!(f, "Conflict: {}", msg),
            Self::Db(msg) => write!(f, "Database error: {}", msg),
        }
    }
}

impl std::error::Error for RepoError {}
