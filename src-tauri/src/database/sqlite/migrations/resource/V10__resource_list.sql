CREATE TABLE IF NOT EXISTS resources (
    id         TEXT PRIMARY KEY NOT NULL,
    course_id  TEXT NOT NULL,
    type_key   TEXT NULL,
    name       TEXT NOT NULL DEFAULT '',
    metadata   TEXT NOT NULL DEFAULT '{}',
    files      TEXT NOT NULL DEFAULT '[]',
    created_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (type_key)  REFERENCES resource_types(key) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_course_id ON resources(course_id);
CREATE INDEX IF NOT EXISTS idx_resources_type_key ON resources(type_key);
