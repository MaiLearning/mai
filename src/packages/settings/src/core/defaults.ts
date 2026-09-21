import {
  DEFAULT_LANGUAGE,
  DEFAULT_SCHEMA_VERSION,
  DEFAULT_THEME,
  GENERAL_ITEM_ID,
  SETTINGS_LANGUAGE_OPTIONS,
  SETTINGS_THEME_OPTIONS,
  SYSTEM_DOMAIN,
} from './constants'
import type { SettingsDocument, SettingsField } from './model'

/** Поле одиночного выбора с каноническими опциями — как ждёт бэкенд. */
function selectionField(options: readonly string[], value: string): SettingsField {
  return {
    type: 'single_selection',
    params: { options: [...options] },
    default: value,
    value,
  }
}

/**
 * Дефолтный документ системных настроек «Общие». Используется, пока пункт
 * не сохранён в БД, и как основа первого сохранения (полная замена документа).
 */
export function defaultSystemSettings(): SettingsDocument {
  return {
    domain: SYSTEM_DOMAIN,
    itemId: GENERAL_ITEM_ID,
    settings: {
      theme: selectionField(SETTINGS_THEME_OPTIONS, DEFAULT_THEME),
      language: selectionField(SETTINGS_LANGUAGE_OPTIONS, DEFAULT_LANGUAGE),
    },
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    createdAt: 0,
    updatedAt: 0,
  }
}
