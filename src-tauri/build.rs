// Пилот-плагин собирается только с cargo-фичей `pilot` (dev-инструмент AI-тестирования).
// Без фичи capabilities ограничиваются default.json: tauri-build валидирует все файлы
// capabilities/, и пермишен pilot:default без слинкованного плагина уронил бы сборку.
fn main() {
    let pattern: &'static str = if std::env::var_os("CARGO_FEATURE_PILOT").is_some() {
        "./capabilities/**/*.json"
    } else {
        "./capabilities/default.json"
    };
    println!("cargo:rerun-if-changed=capabilities");
    tauri_build::try_build(tauri_build::Attributes::new().capabilities_path_pattern(pattern))
        .expect("failed to run tauri-build");
}
