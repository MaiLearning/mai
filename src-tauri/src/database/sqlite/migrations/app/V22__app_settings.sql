-- Настройки приложения: самодостаточный JSON-документ на пункт (domain, item_id)
CREATE TABLE app_settings (
    domain         TEXT    NOT NULL CHECK (domain IN ('system','plugin','course')),
    item_id        TEXT    NOT NULL,
    payload        TEXT    NOT NULL,
    schema_version INTEGER NOT NULL DEFAULT 1,
    created_at     INTEGER NOT NULL,
    updated_at     INTEGER NOT NULL,
    PRIMARY KEY (domain, item_id)
);