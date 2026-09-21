import { invoke } from '@mai/tauri/ipc'
import type { SettingsDocument } from '../core/model'

/** Сохранить документ пункта (полная замена) → итоговый документ. */
export function sendSettingsUpdate(
  domain: string,
  itemId: string,
  settings: SettingsDocument['settings'],
): Promise<unknown> {
  return invoke<unknown>('settings_update', { domain, itemId, settings })
}
