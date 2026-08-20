import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_NS, I18N_OPTIONS, NAMESPACES, SUPPORTED_LANGUAGES, resolveInitialLanguage } from './config'
import commonEn from './locales/en/common.json'
import homeEn from './locales/en/home.json'
import settingsEn from './locales/en/settings.json'
import commonRu from './locales/ru/common.json'
import homeRu from './locales/ru/home.json'
import settingsRu from './locales/ru/settings.json'

let initialized = false

/**
 * Инициализирует i18next с базовыми русскими и английскими переводами.
 * Идемпотентна: повторные вызовы не перезаписывают уже настроенный инстанс.
 *
 * Автоматическая детекция отключена. Стартовый язык определяется через
 * `resolveInitialLanguage()` (чтение `localStorage` по ключу `mai.lang`,
 * валидация через `SUPPORTED_LANGUAGES`, fallback на `ru`).
 * Ручное переключение — `useCurrentLanguage().setLanguage(lang)`.
 */
export async function initI18n(): Promise<void> {
  if (initialized) return

  await i18next.use(initReactI18next).init({
    ...I18N_OPTIONS,
    lng: resolveInitialLanguage(),
    defaultNS: DEFAULT_NS,
    ns: NAMESPACES,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    resources: {
      ru: { common: commonRu, home: homeRu, settings: settingsRu },
      en: { common: commonEn, home: homeEn, settings: settingsEn },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  })

  initialized = true
}

export { i18next }
