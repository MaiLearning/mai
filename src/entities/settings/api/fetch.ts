import { warn } from '@tauri-apps/plugin-log'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import type { AppSettings } from '../core/model'
import { readMemorySettings } from './memory'

/**
 * Invoke-заглушка: команды `settings_get` на backend ещё нет, значение
 * обслуживается in-memory памятью. При появлении команды заменить тело
 * на `invoke<AppSettings>('settings_get')`.
 */
function invokeFetchSettings(): Promise<AppSettings> {
  warn('Настройки читаются из invoke-заглушки: backend-команда settings_get не реализована')

  return Promise.resolve(readMemorySettings())
}

/** Прочитать настройки. */
export function sendFetchSettings(): Promise<AppSettings> {
  return isFakeDataEnabled ? Promise.resolve(readMemorySettings()) : invokeFetchSettings()
}
