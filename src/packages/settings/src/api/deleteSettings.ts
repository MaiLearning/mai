import { invoke } from '@mai/tauri/ipc'

/** Удалить пункт настроек: true — удалён, false — пункта не было. */
export function sendSettingsDelete(domain: string, itemId: string): Promise<boolean> {
  return invoke<boolean>('settings_delete', { domain, itemId })
}
