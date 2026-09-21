import { invoke } from '@mai/tauri/ipc'

/** Документ настроек пункта. Отсутствующий пункт — не ошибка: null. */
export function sendSettingsGet(domain: string, itemId: string): Promise<unknown> {
  return invoke<unknown>('settings_get', { domain, itemId })
}
