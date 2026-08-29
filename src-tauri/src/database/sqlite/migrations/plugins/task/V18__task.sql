CREATE TABLE IF NOT EXISTS task (
    resource_id TEXT PRIMARY KEY NOT NULL,
    content     TEXT NOT NULL DEFAULT '{}',
    created_at  INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at  INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);
