// Данные курса — доменная модель.
// created_at и updated_at хранятся как Integer (epoch-millis).
// Это упрощает работу с SQLite (нет парсинга datetime-строк),
// сравнение и сортировку, а также исключает проблемы с timezone.

use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct CourseData {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    /// Тема/категория курса (для отображения на карточке).
    pub topic: Option<String>,
    /// Начальный цвет градиента карточки (hex, например "#6a54ff").
    pub color_from: Option<String>,
    /// Конечный цвет градиента карточки (hex).
    pub color_to: Option<String>,
    /// Статус прохождения: draft | in_progress | completed.
    pub status: String,
    pub created_at: i64,
    pub updated_at: i64,
}
