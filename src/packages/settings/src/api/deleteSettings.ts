import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendSettingsDelete } from './fake'

/** Удалить пункт настроек: true — удалён, false — пункта не было. */
export function sendSettingsDelete(domain: string, itemId: string): Promise<boolean> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendSettingsDelete(domain, itemId)

  return invoke<boolean>('settings_delete', { domain, itemId })
}
