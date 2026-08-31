-- Реляционная модель task-плагина вместо opaque JSON (V18__task.sql).
-- Старые данные не переносятся — чистый лист.

DROP TABLE task;

CREATE TABLE task_content (
    resource_id TEXT PRIMARY KEY NOT NULL,
    created_at  INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at  INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE TABLE task_difficulties (
    resource_id TEXT NOT NULL,
    id          TEXT NOT NULL,
    label       TEXT NOT NULL,
    color       TEXT NOT NULL,
    position    INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (resource_id, id),
    FOREIGN KEY (resource_id) REFERENCES task_content(resource_id) ON DELETE CASCADE
);

CREATE TABLE tasks (
    id            TEXT PRIMARY KEY NOT NULL,
    resource_id   TEXT NOT NULL,
    kind          TEXT NOT NULL CHECK (kind IN ('SingleChoice','MultipleChoice','TrueFalse','Matching','Ordering','FillInBlank','OpenAnswer')),
    prompt        TEXT NOT NULL DEFAULT '',
    difficulty    TEXT NOT NULL DEFAULT 'easy',
    position      INTEGER NOT NULL DEFAULT 0,
    answer_bool   INTEGER NULL,
    sample_answer TEXT NULL,
    placeholder   TEXT NULL,
    created_at    INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    updated_at    INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (resource_id) REFERENCES task_content(resource_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tasks_resource ON tasks(resource_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tasks_uq_pos ON tasks(resource_id, position);

CREATE TABLE task_choices (
    id       TEXT NOT NULL,
    task_id  TEXT NOT NULL,
    text     TEXT NOT NULL DEFAULT '',
    correct  INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE task_match_pairs (
    id        TEXT NOT NULL,
    task_id   TEXT NOT NULL,
    pair_left  TEXT NOT NULL DEFAULT '',
    pair_right TEXT NOT NULL DEFAULT '',
    position  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE task_ordering_items (
    id       TEXT NOT NULL,
    task_id  TEXT NOT NULL,
    text     TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE task_blank_segments (
    id       TEXT NOT NULL,
    task_id  TEXT NOT NULL,
    text     TEXT NOT NULL DEFAULT '',
    blank    TEXT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE task_progress (
    task_id    TEXT PRIMARY KEY NOT NULL,
    kind       TEXT NOT NULL CHECK (kind IN ('SingleChoice','MultipleChoice','TrueFalse','Matching','Ordering','FillInBlank','OpenAnswer')),
    choice_id  TEXT NULL,
    value_bool INTEGER NULL,
    text       TEXT NULL,
    result     TEXT NULL CHECK (result IN ('correct','incorrect')),
    completed  INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER) * 1000),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE task_answer_choices (
    task_id   TEXT NOT NULL,
    choice_id TEXT NOT NULL,
    position  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, choice_id),
    FOREIGN KEY (task_id) REFERENCES task_progress(task_id) ON DELETE CASCADE
);

CREATE TABLE task_answer_matches (
    task_id  TEXT NOT NULL,
    left_id  TEXT NOT NULL,
    right_id TEXT NOT NULL,
    PRIMARY KEY (task_id, left_id),
    FOREIGN KEY (task_id) REFERENCES task_progress(task_id) ON DELETE CASCADE
);

CREATE TABLE task_answer_items (
    task_id  TEXT NOT NULL,
    item_id  TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (task_id, item_id),
    FOREIGN KEY (task_id) REFERENCES task_progress(task_id) ON DELETE CASCADE
);

CREATE TABLE task_answer_blanks (
    task_id    TEXT NOT NULL,
    segment_id TEXT NOT NULL,
    value      TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (task_id, segment_id),
    FOREIGN KEY (task_id) REFERENCES task_progress(task_id) ON DELETE CASCADE
);

CREATE TABLE task_attempts (
    id         TEXT PRIMARY KEY NOT NULL,
    task_id    TEXT NOT NULL,
    seq        INTEGER NOT NULL,
    kind       TEXT NOT NULL CHECK (kind IN ('SingleChoice','MultipleChoice','TrueFalse','Matching','Ordering','FillInBlank','OpenAnswer')),
    choice_id  TEXT NULL,
    value_bool INTEGER NULL,
    text       TEXT NULL,
    result     TEXT NOT NULL CHECK (result IN ('correct','incorrect')),
    checked_at INTEGER NOT NULL,
    UNIQUE (task_id, seq),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_task_attempts_task ON task_attempts(task_id);

CREATE TABLE task_attempt_choices (
    attempt_id TEXT NOT NULL,
    choice_id  TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (attempt_id, choice_id),
    FOREIGN KEY (attempt_id) REFERENCES task_attempts(id) ON DELETE CASCADE
);

CREATE TABLE task_attempt_matches (
    attempt_id TEXT NOT NULL,
    left_id    TEXT NOT NULL,
    right_id   TEXT NOT NULL,
    PRIMARY KEY (attempt_id, left_id),
    FOREIGN KEY (attempt_id) REFERENCES task_attempts(id) ON DELETE CASCADE
);

CREATE TABLE task_attempt_items (
    attempt_id TEXT NOT NULL,
    item_id    TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (attempt_id, item_id),
    FOREIGN KEY (attempt_id) REFERENCES task_attempts(id) ON DELETE CASCADE
);

CREATE TABLE task_attempt_blanks (
    attempt_id TEXT NOT NULL,
    segment_id TEXT NOT NULL,
    value      TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (attempt_id, segment_id),
    FOREIGN KEY (attempt_id) REFERENCES task_attempts(id) ON DELETE CASCADE
);
