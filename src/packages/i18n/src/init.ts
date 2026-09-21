import i18next from 'i18next'
import {
  type AppLanguage,
  DEFAULT_LANGUAGE,
  DEFAULT_NS,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
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

  // i18next ждёт форму `{ [lang]: { [ns]: dict } }` — собираем её из
  // входных `{ [ns]: { [lang]: dict } }`.
  const ns = Object.keys(resources)
  const formattedResources = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((lang) => [
      lang,
      Object.fromEntries(
        Object.entries(resources).map(([nsName, langs]) => [nsName, langs[lang] ?? {}]),
      ),
    ]),
  )

  i18next.init({
    lng: saved ?? DEFAULT_LANGUAGE,
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: DEFAULT_NS,
    ns,
    resources: formattedResources,
    // Синхронная инициализация: к моменту первого рендера переводы уже на месте.
    initImmediate: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: true },
  })
}

/** Сохраняет язык в localStorage — boot-кэш против мигания до загрузки настроек. */
export function saveLanguage(lang: AppLanguage): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
}

/**
 * Применить язык: переключить i18next и обновить boot-кэш.
 * Источник правды — настройка `language` (@mai/settings); сюда приходит
 * уже выбранное значение.
 */
export function applyLanguage(lang: AppLanguage): void {
  i18next.changeLanguage(lang)
  saveLanguage(lang)
}
