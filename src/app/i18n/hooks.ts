import { useCallback, useMemo } from 'react'
import { useTranslation as useTranslationBase } from 'react-i18next'
import { type AppLanguage, DEFAULT_LANGUAGE, DEFAULT_NS, SUPPORTED_LANGUAGES } from './config'
import { i18next } from './init'

/**
 * Обёртка над `useTranslation` из react-i18next с предзаполненным `defaultNS`.
 * Возвращает тот же кортеж `[t, i18n, ready]`.
 */
export function useTranslation(ns: string | string[] = DEFAULT_NS) {
  return useTranslationBase(ns)
}

/**
 * Доступ к текущему языку интерфейса и переключателю.
 * Подписывается на смену языка через `useTranslation`, поэтому перерендерит
 * при любом источнике изменения (LanguageDetector, другой компонент).
 */
export function useCurrentLanguage(): {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => Promise<void>
  supported: readonly AppLanguage[]
} {
  const { i18n } = useTranslationBase(DEFAULT_NS)
  const language = useMemo<AppLanguage>(
    () =>
      SUPPORTED_LANGUAGES.includes(i18n.language as AppLanguage)
        ? (i18n.language as AppLanguage)
        : DEFAULT_LANGUAGE,
    [i18n.language],
  )
  const setLanguage = useCallback(async (lang: AppLanguage) => {
    await i18next.changeLanguage(lang)
  }, [])

  return useMemo(
    () => ({ language, setLanguage, supported: SUPPORTED_LANGUAGES }),
    [language, setLanguage],
  )
}
