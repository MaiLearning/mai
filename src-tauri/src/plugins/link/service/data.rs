use serde::{Deserialize, Serialize};

/// Статус живости цели ребра: вычисляется при чтении, в БД не хранится.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LinkStatus {
    Ok,
    Broken,
}

/// Цель ребра: ресурс курса, курс или внешний URI.
/// На проводе — тег `kind` со значениями "resource" | "course" | "uri".
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(
    tag = "kind",
    rename_all = "lowercase",
    rename_all_fields = "camelCase"
)]
pub enum LinkTargetData {
    Resource {
        course_id: String,
        resource_id: String,
    },
    Course {
        course_id: String,
    },
    Uri {
        uri: String,
    },
}

impl LinkTargetData {
    /// Имя вида цели (значение тега `kind`, колонка target_kind в БД).
    pub fn kind_name(&self) -> &'static str {
        match self {
            Self::Resource { .. } => "resource",
            Self::Course { .. } => "course",
            Self::Uri { .. } => "uri",
        }
    }

    /// CourseId цели (колонка target_course_id), если вид цели его имеет.
    pub fn course_id(&self) -> Option<&str> {
        match self {
            Self::Resource { course_id, .. } | Self::Course { course_id } => Some(course_id),
            Self::Uri { .. } => None,
        }
    }

    /// ResourceId цели (колонка target_resource_id), если вид цели его имеет.
    pub fn resource_id(&self) -> Option<&str> {
        match self {
            Self::Resource { resource_id, .. } => Some(resource_id),
            _ => None,
        }
    }

    /// URI цели (колонка target_uri), если вид цели его имеет.
    pub fn uri(&self) -> Option<&str> {
        match self {
            Self::Uri { uri } => Some(uri),
            _ => None,
        }
    }
}

/// Ребро графа связей: направленная связь источника с целью.
/// targetStatus — вычисляемое поле (ok/broken), сервис проставляет его при чтении.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinkData {
    pub id: String,
    pub source_type: String,
    pub source_id: String,
    pub target: LinkTargetData,
    pub owner_plugin_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
    pub target_status: LinkStatus,
}

/// Вход создания ребра.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateLinkData {
    pub source_type: String,
    pub source_id: String,
    pub target: LinkTargetData,
    pub owner_plugin_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
}

/// Вход обновления ребра: владение проверяется по owner_plugin_id.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateLinkData {
    pub id: String,
    pub owner_plugin_id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub target: LinkTargetData,
}

/// Ссылка на источник ребра: distinct-пара (source_type, source_id) для sweep.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LinkSourceRef {
    pub source_type: String,
    pub source_id: String,
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn target_serializes_tagged_lowercase() {
        let target = LinkTargetData::Resource {
            course_id: "c-1".into(),
            resource_id: "r-1".into(),
        };
        let value = serde_json::to_value(&target).unwrap();
        assert_eq!(
            value,
            json!({"kind": "resource", "courseId": "c-1", "resourceId": "r-1"})
        );
        let back: LinkTargetData = serde_json::from_value(value).unwrap();
        assert_eq!(back, target);

        let uri = LinkTargetData::Uri {
            uri: "https://example.com".into(),
        };
        assert_eq!(serde_json::to_value(&uri).unwrap()["kind"], "uri");
    }

    #[test]
    fn link_data_uses_camel_case_contract() {
        let link = LinkData {
            id: "l-1".into(),
            source_type: "course".into(),
            source_id: "c-1".into(),
            target: LinkTargetData::Course {
                course_id: "c-2".into(),
            },
            owner_plugin_id: "internal-link".into(),
            title: None,
            description: None,
            created_at: 1,
            updated_at: 2,
            target_status: LinkStatus::Broken,
        };

        let value = serde_json::to_value(&link).unwrap();
        assert_eq!(value["sourceType"], "course");
        assert_eq!(value["sourceId"], "c-1");
        assert_eq!(value["ownerPluginId"], "internal-link");
        assert_eq!(value["createdAt"], 1);
        assert_eq!(value["targetStatus"], "broken");

        let back: LinkData = serde_json::from_value(value).unwrap();
        assert_eq!(back, link);
    }
}
