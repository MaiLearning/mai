pub mod multi_selection;
pub mod single_selection;

use std::collections::BTreeSet;

use super::SchemaError;

/// Потолки списка вариантов — защита размера документа.
pub(super) const MAX_OPTIONS: usize = 64;
pub(super) const MAX_OPTION_LENGTH: usize = 128;

/// Общая валидация `options` для одиночного и множественного выбора.
pub(super) fn validate_options(options: &[String]) -> Result<(), SchemaError> {
    if options.is_empty() {
        return Err(SchemaError::new("options must not be empty"));
    }
    if options.len() > MAX_OPTIONS {
        return Err(SchemaError::new(format!(
            "options must not exceed {} entries",
            MAX_OPTIONS
        )));
    }
    options.iter().try_for_each(|option| {
        if option.is_empty() {
            return Err(SchemaError::new("option must not be empty"));
        }
        if option.chars().count() > MAX_OPTION_LENGTH {
            return Err(SchemaError::new(format!(
                "option must not exceed {} characters",
                MAX_OPTION_LENGTH
            )));
        }
        Ok(())
    })?;

    let unique: BTreeSet<&String> = options.iter().collect();
    if unique.len() != options.len() {
        return Err(SchemaError::new("options must be unique"));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::validate_options;

    #[test]
    fn rejects_empty_duplicates_and_bad_lengths() {
        assert!(validate_options(&[]).is_err());

        let duplicated = vec!["a".to_string(), "a".to_string()];
        assert!(validate_options(&duplicated).is_err());

        let too_long = vec!["x".repeat(200)];
        assert!(validate_options(&too_long).is_err());
    }

    #[test]
    fn accepts_valid_options() {
        let options = vec!["system".to_string(), "dark".to_string()];
        assert!(validate_options(&options).is_ok());
    }
}
