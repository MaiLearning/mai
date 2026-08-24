use crate::services::resource::ResourceTypeData;

/// Метаданные внутреннего плагина для регистрации в БД.
pub struct InternalPluginEntry {
    pub id: &'static str,
    pub name: &'static str,
    pub version: &'static str,
    pub description: Option<&'static str>,

    /// Типы ресурсов, которые регистрирует этот плагин.
    /// `plugin_id` и timestamps подставляются автоматически.
    pub resource_types: Vec<ResourceTypeData>,
}

/// Реестр внутренних плагинов.
///
/// Для добавления нового плагина — добавь запись в этот вектор.
/// Инициализатор при старте автоматически:
/// 1. Зарегистрирует плагин в таблице `plugins` + `internal_plugins`
/// 2. Создаст соответствующие типы ресурсов в `resource_types`
pub fn register_internal_plugins() -> Vec<InternalPluginEntry> {
    vec![InternalPluginEntry {
        id: "internal-theory",
        name: "Теория",
        version: "0.1.0",
        description: Some("WYSIWYG редактор для теоретических материалов"),
        resource_types: vec![ResourceTypeData {
            key: "theory".into(),
            name: "Теория".into(),
            description: Some("Теоретические материалы".into()),
            plugin_id: None,
            supported_extensions: vec![],
            created_at: 0,
            updated_at: 0,
        }],
    }]
}
