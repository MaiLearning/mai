import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import type { SettingsDocument } from '../core/model'
import { fakeSendSettingsUpdate } from './fake'

/** Сохранить документ пункта (полная замена) → итоговый документ. */
export function sendSettingsUpdate(
  domain: string,
  itemId: string,
  settings: SettingsDocument['settings'],
): Promise<unknown> {
  if (import.meta.env.DEV && isFakeDataEnabled()) {
    return fakeSendSettingsUpdate(domain, itemId, settings)
  }

  return invoke<unknown>('settings_update', { domain, itemId, settings })
}
