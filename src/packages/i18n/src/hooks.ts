import { useTranslation as useI18nextTranslation } from 'react-i18next'
import { type AppLanguage, DEFAULT_NS, SUPPORTED_LANGUAGES } from './config'
import { saveLanguage } from './init'

/**
 * Обёртка над useTranslation из react-i18next.
 * Дефолтный namespace — 'common'.
 *
 * @example
 * const { t } = useTranslation('course')
 * <span>{t('title')}</span>
 */
export function useTranslation(ns?: string) {
  return useI18nextTranslation(ns ?? DEFAULT_NS)
}

/**
 * Текущий язык + сеттер с сохранением в localStorage.
 * Возвращает `[lang, setLang]` — аналог useState-паттерна.
 */
export function useCurrentLanguage(): [AppLanguage, (lang: AppLanguage) => void] {
  const { i18n } = useI18nextTranslation()

  const lang = (i18n.language?.slice(0, 2) ?? 'ru') as AppLanguage

  const setLang = (next: AppLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(next)) return
    i18n.changeLanguage(next)
    saveLanguage(next)
  }

  return [lang, setLang]
}
