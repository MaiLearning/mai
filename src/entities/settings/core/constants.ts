import type { AppSettings } from './model'

/**
 * Настройки по умолчанию. Применяются до загрузки сохранённых значений
 * (settingsAtom = null) и как база in-memory хранилища api/.
 */
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'ru',
}
