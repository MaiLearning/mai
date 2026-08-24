use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: String,
}

#[tauri::command]
pub async fn health() -> Result<HealthResponse, String> {
    Ok(HealthResponse {
        status: "ok".into(),
    })
}
