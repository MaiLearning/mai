#[path = "databaseConfig.rs"]
mod database_config;
pub mod db;
pub mod migration;
pub mod pool;
pub mod repositories;
pub mod settings;

pub use database_config::{from_mai_config, DatabaseConfigError};
pub use db::Database;
pub use settings::DatabaseConfig;
