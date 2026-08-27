import { attachConsole } from '@tauri-apps/plugin-log'

// Подключает webview-console как целевой вывод tauri-plugin-log.
// Вызывается один раз при старте приложения (runner-таска init-logger).
export async function initLogger(): Promise<() => void> {
  try {
    return await attachConsole()
  } catch {
    console.info('[Logger] Tauri API недоступен, fallback на console')

    return () => {}
  }
}
