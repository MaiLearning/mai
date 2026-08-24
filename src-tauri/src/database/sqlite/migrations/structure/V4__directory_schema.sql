CREATE TABLE IF NOT EXISTS directories (
    id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
