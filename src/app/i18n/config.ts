export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: AppLanguage = 'ru'
export const FALLBACK_LANGUAGE: AppLanguage = 'en'

export const DEFAULT_NS = 'common'
export const NAMESPACES = ['common', 'settings'] as const

export const LANGUAGE_STORAGE_KEY = 'mai.lang'

export const I18N_DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: LANGUAGE_STORAGE_KEY,
  caches: ['localStorage'],
}
