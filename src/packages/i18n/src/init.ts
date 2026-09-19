import i18next from 'i18next'
import {
  type AppLanguage,
  DEFAULT_LANGUAGE,
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from './config'

let initialized = false

export interface InitI18nOptions {
  /** Ресурсы по namespace: `{ course: { ru: {...}, en: {...} }, common: { ... } }` */
  resources: Record<string, Record<AppLanguage, Record<string, unknown>>>
}

/**
 * Инициализирует i18next (идемпотентно). Вызывается один раз в app shell
 * со всеми namespace-ресурсами (common + пакетные: course и т.д.).
 *
 * @example
 * initI18n({
 *   resources: {
 *     common: { ru: commonRu, en: commonEn },
 *     course: { ru: courseRu, en: courseEn },
 *   },
 * })
 */
export function initI18n({ resources }: InitI18nOptions): void {
  if (initialized) return
  initialized = true

  const saved = (localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null) ?? null

  i18next.init({
    lng: saved ?? DEFAULT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    defaultNS: DEFAULT_NS,
    ns: Object.keys(resources),
    resources: Object.fromEntries(
      Object.entries(resources).map(([ns, langs]) => [
        ns,
        Object.fromEntries(
          Object.entries(langs).map(([lang, translations]) => [
            lang,
            { translation: translations },
          ]),
        ),
      ]),
    ),
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  })
}

/** Сохраняет выбор языка в localStorage для следующего запуска. */
// TODO: сохранить в настройки backend!!
export function saveLanguage(lang: AppLanguage): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
}
