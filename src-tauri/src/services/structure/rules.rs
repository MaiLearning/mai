use super::exceptions::{
    InvalidDirectoryIdException, InvalidDirectoryNameException, InvalidParentException,
    InvalidPositionException, InvalidResourceNameException, InvalidStructureNodeIdException,
    InvalidStructureResourceIdException,
};

pub struct StructureRules;

impl StructureRules {
    pub fn validate_node_id(id: &str) -> Result<String, InvalidStructureNodeIdException> {
        let normalized = id.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidStructureNodeIdException {
                message: "Node id must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    pub fn validate_resource_id(id: &str) -> Result<String, InvalidStructureResourceIdException> {
        let normalized = id.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidStructureResourceIdException {
                message: "Resource id must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    pub fn validate_directory_id(id: &str) -> Result<String, InvalidDirectoryIdException> {
        let normalized = id.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidDirectoryIdException {
                message: "Directory id must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    pub fn validate_directory_name(name: &str) -> Result<String, InvalidDirectoryNameException> {
        let normalized = name.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidDirectoryNameException {
                message: "Directory name must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    pub fn validate_position(position: i64) -> Result<i64, InvalidPositionException> {
        if position < 0 {
            return Err(InvalidPositionException {
                message: "Position must not be negative.".into(),
            });
        }
        Ok(position)
    }

    pub fn validate_course_id(id: &str) -> Result<String, InvalidParentException> {
        let normalized = id.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidParentException {
                message: "Course id must not be empty.".into(),
            });
        }
        Ok(normalized)
    }

    pub fn validate_resource_name(name: &str) -> Result<String, InvalidResourceNameException> {
        let normalized = name.trim().to_string();
        if normalized.is_empty() {
            return Err(InvalidResourceNameException {
                message: "Resource name must not be empty.".into(),
            });
        }
        Ok(normalized)
    }
}
