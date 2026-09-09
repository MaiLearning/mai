import { atom } from 'jotai'
import type { AppSettings } from '../core/model'

/**
 * Сохранённые настройки. null — ещё не загружены (до отработки
 * loadSettingsAtom); потребители предусматривают fallback на DEFAULT_SETTINGS.
 */
export const settingsAtom = atom<AppSettings | null>(null)
