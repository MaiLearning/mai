export { default as i18next } from 'i18next'
export type { AppLanguage } from './config'
export {
  DEFAULT_LANGUAGE,
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from './config'
export { useCurrentLanguage, useTranslation } from './hooks'
export type { InitI18nOptions } from './init'
export { initI18n, saveLanguage } from './init'
export type { I18nProviderProps } from './provider'
export { I18nProvider } from './provider'
