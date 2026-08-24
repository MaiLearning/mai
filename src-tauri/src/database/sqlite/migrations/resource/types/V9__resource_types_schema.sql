CREATE TABLE IF NOT EXISTS resource_types (
    key                  TEXT PRIMARY KEY NOT NULL,
    name                 TEXT NOT NULL,
    description          TEXT NULL,
    plugin_id            TEXT NULL,
    supported_extensions TEXT NOT NULL DEFAULT '[]',
    created_at           INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at           INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_resource_types_plugin_id ON resource_types(plugin_id);
