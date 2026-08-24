-- Метаданные курса для отображения на домашней странице:
-- тема, цвета карточки (градиент) и статус прохождения.
ALTER TABLE courses ADD COLUMN topic TEXT NULL;
ALTER TABLE courses ADD COLUMN color_from TEXT NULL;
ALTER TABLE courses ADD COLUMN color_to TEXT NULL;
ALTER TABLE courses ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'
    CHECK(status IN ('draft', 'in_progress', 'completed'));
