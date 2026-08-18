import { attachConsole } from '@tauri-apps/plugin-log'

/**
 * Инициализирует логгер: подключает console как целевой вывод для
 * `@tauri-apps/plugin-log`. Все последующие вызовы `info()`, `error()` и
 * других уровней будут дублироваться в консоль браузера/терминала.
 *
 * Если Tauri API недоступен (например, при запуске в обычном браузере),
 * логгер молча переключается на fallback без выброса ошибки.
 *
 * @returns Функция отключения — при вызове останавливает дублирование в console.
 */
export async function initLogger(): Promise<() => void> {
  try {
    return await attachConsole()
  } catch {
    console.info('[Logger] Tauri API недоступен, fallback на console')
    return () => {}
  }
}
