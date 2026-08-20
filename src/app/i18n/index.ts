export {
  type AppLanguage,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
} from './config'
export { useCurrentLanguage, useTranslation } from './hooks'
export { i18next, initI18n } from './init'
export { I18nProvider } from './provider'
