//! Слежение за файлом конфигурации через `notify`.

use std::sync::Arc;

use notify::{RecommendedWatcher, RecursiveMode, Watcher};
use serde_json::Value;

use crate::MaiConfig;

pub type WatchError = notify::Error;

/// Живой watcher конфига. Пока объект не дропнут — событие действует.
pub struct ConfigWatcher {
    _watcher: RecommendedWatcher,
}

impl ConfigWatcher {
    /// Следить за файлом конфига: при изменении перечитать и вызвать
    /// `on_change` с новым значением.
    pub fn spawn<F>(config: Arc<MaiConfig>, on_change: F) -> Result<Self, WatchError>
    where
        F: Fn(&Value) + Send + 'static,
    {
        let path = config.path().to_path_buf();
        let watched = path.clone();
        let mut watcher =
            notify::recommended_watcher(move |result: notify::Result<notify::Event>| {
                use notify::event::{EventKind, ModifyKind};

                let Ok(event) = result else { return };
                if !event.paths.iter().any(|p| p == &watched) {
                    return;
                }
                if !matches!(
                    event.kind,
                    EventKind::Create(_) | EventKind::Modify(ModifyKind::Data(_))
                ) {
                    return;
                }
                match config.reload() {
                    Ok(value) => on_change(&value),
                    Err(error) => log::error!("Failed to reload config: {error}"),
                }
            })?;
        watcher.watch(&path, RecursiveMode::NonRecursive)?;
        Ok(Self { _watcher: watcher })
    }
}
