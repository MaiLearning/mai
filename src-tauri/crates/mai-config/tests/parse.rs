use mai_config::parse_file;

#[test]
fn parses_toml_into_json() {
    let path = std::env::temp_dir().join("mai-config-test.toml");
    std::fs::write(
        &path,
        r#"name = "Mai"
version = "0.0.1"

[mode]
default = "development"
available = ["development", "production", "release"]

[mode.development]
debug = true
fake_data = true

[mode.development.database]
path = ".dev/mai_dev.db"
max_connections = 5
"#,
    )
    .unwrap();

    let value = parse_file(&path).unwrap();
    assert_eq!(value["name"], "Mai");
    assert_eq!(value["mode"]["default"], "development");
    assert_eq!(value["mode"]["development"]["fake_data"], true);
    assert_eq!(
        value["mode"]["development"]["database"]["path"],
        ".dev/mai_dev.db"
    );
    assert_eq!(
        value["mode"]["development"]["database"]["max_connections"],
        5
    );

    std::fs::remove_file(&path).unwrap();
}

#[test]
fn missing_file_is_an_error() {
    let path = std::env::temp_dir().join("mai-config-does-not-exist.toml");
    assert!(parse_file(&path).is_err());
}
