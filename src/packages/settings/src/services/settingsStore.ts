import { error } from '@mai/tauri/logs'
import { atom, getDefaultStore } from 'jotai'
import { sendSettingsGet, sendSettingsUpdate } from '../api'
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
import { defaultSystemSettings } from '../core/defaults'
import type { SettingsDocument, SettingsField } from '../core/model'
import { parseSettingsDocument } from '../core/schema'

/** Документ системных настроек «Общие». До загрузки — дефолт. */
export const systemSettingsAtom = atom<SettingsDocument>(defaultSystemSettings())

/** Готовность настроек: выставляет таска `init_settings` после загрузки. */
export const settingsReadyAtom = atom(false)

function readTheme(doc: SettingsDocument): SettingsTheme {
  const value = doc.settings.theme?.value

  return SETTINGS_THEME_OPTIONS.includes(value as SettingsTheme)
    ? (value as SettingsTheme)
    : DEFAULT_THEME
}

function readLanguage(doc: SettingsDocument): SettingsLanguage {
  const value = doc.settings.language?.value

  return SETTINGS_LANGUAGE_OPTIONS.includes(value as SettingsLanguage)
    ? (value as SettingsLanguage)
    : DEFAULT_LANGUAGE
}

/** Текущая тема оформления (значение или дефолт). */
export const systemThemeAtom = atom((get) => readTheme(get(systemSettingsAtom)))

/** Текущий язык интерфейса (значение или дефолт). */
export const systemLanguageAtom = atom((get) => readLanguage(get(systemSettingsAtom)))

const store = getDefaultStore()

/** Патч значений системных настроек «Общие». */
export interface SystemSettingsPatch {
  theme?: SettingsTheme
  language?: SettingsLanguage
}

/**
 * Инициализация системных настроек на старте: чтение пункта «Общие».
 * Пункта нет или бэкенд недоступен — остаются дефолты (приложение не падает).
 */
export async function initSystemSettings(): Promise<SettingsDocument> {
  try {
    const raw = await sendSettingsGet(SYSTEM_DOMAIN, GENERAL_ITEM_ID)
    if (raw !== null) store.set(systemSettingsAtom, parseSettingsDocument(raw))
  } catch (e) {
    error(`Не удалось прочитать системные настройки: ${e instanceof Error ? e.message : String(e)}`)
  }

  return store.get(systemSettingsAtom)
}

/** Текущий документ системных настроек «Общие». */
export function getSystemSettings(): SettingsDocument {
  return store.get(systemSettingsAtom)
}

/**
 * Сохранить патч системных настроек: текущий документ + патч → полная замена
 * на бэкенде (он валидирует и подставляет дефолты) → итоговый документ в атом.
 */
export async function updateSystemSettings(patch: SystemSettingsPatch): Promise<SettingsDocument> {
  const current = store.get(systemSettingsAtom)
  const settings = { ...current.settings }

  if (patch.theme !== undefined) {
    settings.theme = mergeValue(settings.theme, patch.theme)
  }
  if (patch.language !== undefined) {
    settings.language = mergeValue(settings.language, patch.language)
  }

  const raw = await sendSettingsUpdate(SYSTEM_DOMAIN, GENERAL_ITEM_ID, settings)
  const next = parseSettingsDocument(raw)
  store.set(systemSettingsAtom, next)

  return next
}

/** Копия поля с новым значением; нет поля — берётся заготовка системных. */
function mergeValue(field: SettingsField | undefined, value: unknown): SettingsField {
  const base = field ?? defaultSystemSettings().settings.theme

  return { ...base, value }
}
