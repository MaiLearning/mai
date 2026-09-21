import { useAtomValue } from 'jotai'
import { systemLanguageAtom, systemSettingsAtom, systemThemeAtom } from '../services/settingsStore'

/** Документ системных настроек «Общие» (реактивно). */
export function useSystemSettings() {
  return useAtomValue(systemSettingsAtom)
}

/** Текущая тема оформления (реактивно). */
export function useSystemTheme() {
  return useAtomValue(systemThemeAtom)
}

/** Текущий язык интерфейса (реактивно). */
export function useSystemLanguage() {
  return useAtomValue(systemLanguageAtom)
}
