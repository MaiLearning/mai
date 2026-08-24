use refinery::embed_migrations;
use refinery::Runner;

embed_migrations!("src/database/sqlite/migrations");

pub struct MigrationRunner {
    runner: Runner,
}

impl MigrationRunner {
    pub fn new() -> Self {
        Self {
            runner: migrations::runner().set_grouped(true),
        }
    }

    pub fn run(&self, db_path: &str) {
        if let Some(parent) = std::path::Path::new(db_path).parent() {
            std::fs::create_dir_all(parent).expect("failed to create database directory");
        }

        let mut conn =
            rusqlite::Connection::open(db_path).expect("failed to open database for migrations");
        self.runner
            .run(&mut conn)
            .expect("failed to run database migrations");
    }
}
