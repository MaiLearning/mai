/**
 * Домены настроек — зеркало валидации бэкенда (services/settings/rules.rs).
 */
export const SYSTEM_DOMAIN = 'system'
export const PLUGIN_DOMAIN = 'plugin'
export const COURSE_DOMAIN = 'course'

export const SETTINGS_DOMAINS = [SYSTEM_DOMAIN, PLUGIN_DOMAIN, COURSE_DOMAIN] as const
export type SettingsDomain = (typeof SETTINGS_DOMAINS)[number]

/** Пункт системных настроек «Общие». */
export const GENERAL_ITEM_ID = 'general'

/** Варианты темы оформления — зеркало опций поля theme. */
export const SETTINGS_THEME_OPTIONS = ['system', 'light', 'dark'] as const
export type SettingsTheme = (typeof SETTINGS_THEME_OPTIONS)[number]

/** Поддерживаемые языки интерфейса — зеркало опций поля language. */
export const SETTINGS_LANGUAGE_OPTIONS = ['ru', 'en'] as const
export type SettingsLanguage = (typeof SETTINGS_LANGUAGE_OPTIONS)[number]

export const DEFAULT_THEME: SettingsTheme = 'system'
export const DEFAULT_LANGUAGE: SettingsLanguage = 'ru'

/** Версия схемы документа — зеркало DEFAULT_SCHEMA_VERSION на бэкенде. */
export const DEFAULT_SCHEMA_VERSION = 1
