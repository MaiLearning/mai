import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import {
  DEFAULT_LANGUAGE,
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  I18N_DETECTION_OPTIONS,
  NAMESPACES,
} from './config'
import commonEn from './locales/en/common.json'
import settingsEn from './locales/en/settings.json'
import commonRu from './locales/ru/common.json'
import settingsRu from './locales/ru/settings.json'

let initialized = false

/**
 * Инициализирует i18next с базовыми русскими и английскими переводами.
 * Идемпотентна: повторные вызовы не перезаписывают уже настроенный инстанс.
 *
 * Язык определяется через localStorage (`mai.lang`), затем navigator,
 * fallback — английский. Базовые бандлы: `common` и `settings`.
 */
export async function initI18n(): Promise<void> {
  if (initialized) return

  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      fallbackLng: FALLBACK_LANGUAGE,
      lng: DEFAULT_LANGUAGE,
      defaultNS: DEFAULT_NS,
      ns: NAMESPACES,
      supportedLngs: ['ru', 'en'],
      resources: {
        ru: { common: commonRu, settings: settingsRu },
        en: { common: commonEn, settings: settingsEn },
      },
      detection: I18N_DETECTION_OPTIONS,
      interpolation: { escapeValue: false },
      react: { useSuspense: true },
    })

  initialized = true
}

export { i18next }
