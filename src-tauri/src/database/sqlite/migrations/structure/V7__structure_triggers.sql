-- Trigger: auto-update updated_at on structure row change
CREATE TRIGGER IF NOT EXISTS trg_structures_set_updated_at
BEFORE UPDATE ON structures
WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE structures SET updated_at = CAST(strftime('%s','now') AS INTEGER) * 1000 WHERE id = OLD.id;
END;
