-- Trigger: auto-create root structure node when a resource is inserted
CREATE TRIGGER IF NOT EXISTS trg_resource_create_structure
AFTER INSERT ON resources
BEGIN
    INSERT INTO structures (id, course_id, parent_id, resource_id, directory_id, position)
    VALUES (
        NEW.id,
        NEW.course_id,
        NULL,
        NEW.id,
        NULL,
        (SELECT COALESCE(MAX(position), -1) + 1
         FROM structures
         WHERE course_id = NEW.course_id
           AND parent_id IS NULL)
    );
END;
