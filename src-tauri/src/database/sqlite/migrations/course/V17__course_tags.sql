-- Система тегов курсов.
-- tags — общий реестр тегов (уникальное имя без учёта регистра),
-- course_tags — связь many-to-many между курсами и тегами.
-- Колонка courses.topic объявлена устаревшей: её значения переносятся в tags,
-- колонка остаётся в таблице для обратной совместимости SQLite (без rebuild).

CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL COLLATE NOCASE UNIQUE,
    created_at INTEGER NOT NULL
);

CREATE TABLE course_tags (
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, tag_id)
);

CREATE INDEX idx_course_tags_course_id ON course_tags(course_id);
CREATE INDEX idx_course_tags_tag_id ON course_tags(tag_id);

-- Перенос существующих тем в теги
INSERT INTO tags (id, name, created_at)
SELECT lower(hex(randomblob(16))), trim(topic), CAST(strftime('%s', 'now') AS INTEGER) * 1000
FROM courses
WHERE topic IS NOT NULL AND trim(topic) <> ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO course_tags (course_id, tag_id)
SELECT c.id, t.id
FROM courses c
JOIN tags t ON t.name = trim(c.topic)
WHERE c.topic IS NOT NULL AND trim(c.topic) <> '';
