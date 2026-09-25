use std::path::Path;

use serde_json::json;

use super::*;

#[test]
fn extracts_database_config_for_profile() {
    let raw = json!({
        "mode": {
            "development": {
                "database": {
                    "path": ".dev/mai_dev.db",
                    "max_connections": 3
                }
            },
            "release": {
                "database": {
                    "path": "storage/mai.db",
                    "max_connections": 7
                }
            }
        }
    });
    let app_data_dir = std::env::temp_dir().join("mai-app-data");

    let development =
        from_mai_config_for_profile(&raw, &app_data_dir, DatabaseProfile::Development).unwrap();
    let release =
        from_mai_config_for_profile(&raw, &app_data_dir, DatabaseProfile::Release).unwrap();

    assert_eq!(development.path, app_data_dir.join(".dev/mai_dev.db"));
    assert_eq!(development.max_connections, 3);
    assert_eq!(release.path, app_data_dir.join("storage/mai.db"));
    assert_eq!(release.max_connections, 7);
}

#[test]
fn selects_profile_by_build_configuration() {
    let expected = if cfg!(debug_assertions) {
        DatabaseProfile::Development
    } else {
        DatabaseProfile::Release
    };

    assert_eq!(DatabaseProfile::current(), expected);
}

#[test]
fn keeps_absolute_database_path() {
    let absolute_path = std::env::temp_dir().join("mai-absolute.db");
    let raw = json!({
        "mode": {
            "release": {
                "database": {
                    "path": absolute_path.to_string_lossy(),
                    "max_connections": 5
                }
            }
        }
    });

    let config =
        from_mai_config_for_profile(&raw, Path::new("unused"), DatabaseProfile::Release).unwrap();

    assert_eq!(config.path, absolute_path);
}

#[test]
fn validates_every_available_mode() {
    let raw = json!({
        "mode": {
            "available": ["development", "production", "release"],
            "development": {
                "database": { "path": ".dev/mai.db", "max_connections": 3 }
            },
            "production": {
                "database": { "path": "storage/mai.db", "max_connections": 5 }
            },
            "release": {
                "database": { "path": "storage/mai.db", "max_connections": 7 }
            }
        }
    });

    let config = from_mai_config(&raw, Path::new("app-data")).unwrap();
    let expected = if cfg!(debug_assertions) {
        ("app-data/.dev/mai.db", 3)
    } else {
        ("app-data/storage/mai.db", 7)
    };

    assert_eq!(config.path, Path::new(expected.0));
    assert_eq!(config.max_connections, expected.1);
}

#[test]
fn rejects_missing_non_active_mode_database() {
    let raw = json!({
        "mode": {
            "available": ["development", "production"],
            "development": {
                "database": { "path": ".dev/mai.db", "max_connections": 3 }
            },
            "production": {}
        }
    });

    let error = from_mai_config(&raw, Path::new("app-data")).unwrap_err();
    assert!(error.to_string().contains("mode.production.database"));
}

#[test]
fn rejects_missing_and_invalid_database_fields() {
    let cases = [
        (
            json!({"mode": {"development": {}}}),
            "mode.development.database",
        ),
        (
            json!({"mode": {"development": {"database": {"max_connections": 5}}}}),
            "path",
        ),
        (
            json!({"mode": {"development": {"database": {"path": "", "max_connections": 5}}}}),
            "путь не должен быть пустым",
        ),
        (
            json!({"mode": {"development": {"database": {"path": 42, "max_connections": 5}}}}),
            "expected a string",
        ),
        (
            json!({"mode": {"development": {"database": {"path": "mai.db", "max_connections": 0}}}}),
            "больше 0",
        ),
        (
            json!({"mode": {"development": {"database": {"path": "mai.db", "max_connections": -1}}}}),
            "expected u32",
        ),
    ];

    for (raw, expected) in cases {
        let error =
            from_mai_config_for_profile(&raw, Path::new("app-data"), DatabaseProfile::Development)
                .unwrap_err();
        assert!(
            error.to_string().contains(expected),
            "unexpected error: {error}"
        );
    }
}

#[test]
fn test_config_uses_system_temp_dir() {
    let config = DatabaseConfig::for_test();

    assert!(config.path.starts_with(std::env::temp_dir()));
    assert_eq!(config.max_connections, 2);
}
