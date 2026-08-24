CREATE TABLE IF NOT EXISTS internal_plugins (
    plugin_id TEXT PRIMARY KEY NOT NULL,
    FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS external_plugins (
    plugin_id TEXT PRIMARY KEY NOT NULL,
    sdk_version TEXT NOT NULL,
    FOREIGN KEY (plugin_id) REFERENCES plugins(id) ON DELETE CASCADE
);
