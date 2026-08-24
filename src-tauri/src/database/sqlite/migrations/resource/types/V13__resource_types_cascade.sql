CREATE TABLE resource_types_new AS SELECT * FROM resource_types;
DROP TABLE resource_types;

CREATE TABLE resource_types (
    key                  TEXT PRIMARY KEY NOT NULL,
    name                 TEXT NOT NULL,
    description          TEXT NULL,
    plugin_id            TEXT NULL,
    supported_extensions TEXT NOT NULL DEFAULT '[]',
    created_at           INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at           INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE
);

INSERT INTO resource_types SELECT * FROM resource_types_new;
DROP TABLE resource_types_new;

CREATE INDEX IF NOT EXISTS idx_resource_types_plugin_id ON resource_types(plugin_id);
