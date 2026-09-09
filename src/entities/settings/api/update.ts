import { warn } from '@tauri-apps/plugin-log'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import type { AppSettings } from '../core/model'
import { writeMemorySettings } from './memory'

/**
 * Invoke-заглушка: команды `settings_update` на backend ещё нет, значение
 * пишется в in-memory память. При появлении команды заменить тело
 * на `invoke<AppSettings>('settings_update', { settings })`.
 */
function invokeUpdateSettings(settings: AppSettings): Promise<AppSettings> {
  warn('Настройки пишутся в invoke-заглушку: backend-команда settings_update не реализована')

  return Promise.resolve(writeMemorySettings(settings))
}

/** Сохранить настройки (полная замена). Возвращает итоговое значение. */
export function sendUpdateSettings(settings: AppSettings): Promise<AppSettings> {
  return isFakeDataEnabled
    ? Promise.resolve(writeMemorySettings(settings))
    : invokeUpdateSettings(settings)
}
