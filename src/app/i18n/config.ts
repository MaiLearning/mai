export const SUPPORTED_LANGUAGES = ['ru', 'en'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: AppLanguage = 'ru'
export const FALLBACK_LANGUAGE: AppLanguage = 'ru'

export const DEFAULT_NS = 'common'
export const NAMESPACES = ['common', 'settings', 'home', 'viewer', 'courseModal'] as const

export const LANGUAGE_STORAGE_KEY = 'mai.lang'

export const I18N_OPTIONS = {
  fallbackLng: FALLBACK_LANGUAGE,
} as const

/**
 * Определяет стартовый язык приложения: читает `localStorage` по ключу
 * `mai.lang` и валидирует значение через `SUPPORTED_LANGUAGES`.
 * При отсутствии/невалидности или недоступности `localStorage`
 * возвращает `DEFAULT_LANGUAGE`.
 *
 * Единый источник правды для `initI18n()` и `useCurrentLanguage()`,
 * чтобы фактический язык i18next и состояние селектора не разъезжались.
 */
export function resolveInitialLanguage(): AppLanguage {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as AppLanguage
    }
  } catch {
    // localStorage недоступен (SSR/ограничения окружения) — fallback ниже
  }
  return DEFAULT_LANGUAGE
}
