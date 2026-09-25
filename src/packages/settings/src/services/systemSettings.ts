import { atom } from 'jotai'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  GENERAL_ITEM_ID,
  SETTINGS_LANGUAGE_OPTIONS,
  SETTINGS_THEME_OPTIONS,
  type SettingsLanguage,
  type SettingsTheme,
  SYSTEM_DOMAIN,
} from '../core/constants'
import { createDefaultDocument } from '../core/documentAdapter'
import type { SettingsDocument } from '../core/model'
import { systemSettingsDefinition } from '../core/systemSettings'
import {
  loadSettingsDocument,
  readSettingsState,
  settingsDocumentFamily,
  settingsStateKey,
} from './settingsDocumentStore'

/** Ключ пункта системных настроек «Общие» в сторе документов. */
export const systemSettingsKey = settingsStateKey(SYSTEM_DOMAIN, GENERAL_ITEM_ID)

/** Готовность системных настроек: выставляет таска `init_settings`. */
export const settingsReadyAtom = atom(false)

const systemStateAtom = settingsDocumentFamily(systemSettingsKey)

/** Документ «Общие»; до загрузки — документ, собранный из дефолтов определения. */
function defaultSystemDocument(): SettingsDocument {
  return createDefaultDocument(SYSTEM_DOMAIN, GENERAL_ITEM_ID, systemSettingsDefinition)
}

/** Документ системных настроек «Общие» (реактивно). */
export const systemSettingsAtom = atom<SettingsDocument>(
  (get) => get(systemStateAtom).document ?? defaultSystemDocument(),
)

/** Тема оформления из значений пункта: правки применяются до сохранения. */
export const systemThemeAtom = atom<SettingsTheme>((get) => {
  const value = get(systemStateAtom).values.theme

  return SETTINGS_THEME_OPTIONS.includes(value as SettingsTheme)
    ? (value as SettingsTheme)
    : DEFAULT_THEME
})

/** Язык интерфейса из значений пункта: правки применяются до сохранения. */
export const systemLanguageAtom = atom<SettingsLanguage>((get) => {
  const value = get(systemStateAtom).values.language

  return SETTINGS_LANGUAGE_OPTIONS.includes(value as SettingsLanguage)
    ? (value as SettingsLanguage)
    : DEFAULT_LANGUAGE
})

/**
 * Инициализация системных настроек на старте: чтение пункта «Общие».
 * Пункта нет или бэкенд недоступен — остаются дефолты (приложение не падает).
 */
export async function initSystemSettings(): Promise<SettingsDocument> {
  await loadSettingsDocument(
    systemSettingsKey,
    systemSettingsDefinition,
    SYSTEM_DOMAIN,
    GENERAL_ITEM_ID,
  )

  return getSystemSettings()
}

/** Текущий документ системных настроек «Общие». */
export function getSystemSettings(): SettingsDocument {
  return readSettingsState(systemSettingsKey).document ?? defaultSystemDocument()
}
