CREATE UNIQUE INDEX IF NOT EXISTS idx_structures_uq_pos_child
    ON structures(course_id, parent_id, position)
    WHERE parent_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_structures_uq_pos_root
    ON structures(course_id, position)
    WHERE parent_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_structures_course_id ON structures(course_id);
CREATE INDEX IF NOT EXISTS idx_structures_parent_id ON structures(parent_id);
CREATE INDEX IF NOT EXISTS idx_structures_directory_id ON structures(directory_id);
