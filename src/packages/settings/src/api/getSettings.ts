import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendSettingsGet } from './fake'

/** Документ настроек пункта. Отсутствующий пункт — не ошибка: null. */
export function sendSettingsGet(domain: string, itemId: string): Promise<unknown> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendSettingsGet(domain, itemId)

  return invoke<unknown>('settings_get', { domain, itemId })
}
