use std::path::PathBuf;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DatabaseConfig {
    pub path: PathBuf,
    pub max_connections: u32,
}

impl DatabaseConfig {
    #[cfg(test)]
    pub fn for_test() -> Self {
        let path = std::env::temp_dir().join(format!("mai_test_{}.db", uuid::Uuid::new_v4()));
        Self {
            path,
            max_connections: 2,
        }
    }
}
