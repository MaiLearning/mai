use super::exceptions::CodeServiceError;

/// Поддерживаемые языки исполнения.
pub const SUPPORTED_LANGUAGES: [&str; 3] = ["python", "javascript", "rust"];

/// Максимальный размер исполняемого кода — 256 KB.
const MAX_CODE_BYTES: usize = 256 * 1024;

/// Язык должен быть одним из поддерживаемых.
pub fn validate_language(language: &str) -> Result<(), CodeServiceError> {
    if SUPPORTED_LANGUAGES.contains(&language) {
        Ok(())
    } else {
        Err(CodeServiceError::Validation(format!(
            "Неподдерживаемый язык '{}': доступные — {}",
            language,
            SUPPORTED_LANGUAGES.join(", ")
        )))
    }
}

/// Контент code-ресурса должен быть JSON-объектом.
pub fn validate_content(content: &serde_json::Value) -> Result<(), CodeServiceError> {
    if content.is_object() {
        Ok(())
    } else {
        Err(CodeServiceError::Validation(
            "Контент должен быть JSON-объектом".to_string(),
        ))
    }
}

/// Код не пустой и укладывается в лимит размера.
pub fn validate_code(code: &str) -> Result<(), CodeServiceError> {
    if code.trim().is_empty() {
        return Err(CodeServiceError::Validation(
            "Код не может быть пустым".to_string(),
        ));
    }
    if code.len() > MAX_CODE_BYTES {
        return Err(CodeServiceError::Validation(format!(
            "Код превышает лимит размера ({} байт)",
            MAX_CODE_BYTES
        )));
    }
    Ok(())
}
