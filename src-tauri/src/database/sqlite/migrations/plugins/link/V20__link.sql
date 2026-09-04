CREATE TABLE links (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL CHECK (source_type IN ('resource','course')),
    source_id TEXT NOT NULL,
    target_kind TEXT NOT NULL CHECK (target_kind IN ('resource','course','uri')),
    target_course_id TEXT,
    target_resource_id TEXT,
    target_uri TEXT,
    owner_plugin_id TEXT NOT NULL,
    title TEXT,
    description TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CHECK (target_kind <> 'resource' OR (target_course_id IS NOT NULL AND target_resource_id IS NOT NULL)),
    CHECK (target_kind <> 'course'   OR target_course_id IS NOT NULL),
    CHECK (target_kind <> 'uri'      OR target_uri IS NOT NULL)
);
CREATE INDEX idx_links_source ON links (source_type, source_id);
CREATE INDEX idx_links_target_resource ON links (target_resource_id) WHERE target_resource_id IS NOT NULL;
CREATE INDEX idx_links_target_course ON links (target_course_id) WHERE target_course_id IS NOT NULL;
CREATE INDEX idx_links_target_uri ON links (target_uri) WHERE target_uri IS NOT NULL;
CREATE INDEX idx_links_owner ON links (owner_plugin_id);
