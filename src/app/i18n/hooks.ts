import { useCallback, useMemo, useState } from 'react'
import { useTranslation as useTranslationBase } from 'react-i18next'
import {
  type AppLanguage,
  LANGUAGE_STORAGE_KEY,
  NAMESPACES,
  SUPPORTED_LANGUAGES,
  resolveInitialLanguage,
} from './config'
import { i18next } from './init'

/**
 * Обёртка над `useTranslation` из react-i18next с предзаполненным `defaultNS`.
 * Возвращает тот же кортеж `[t, i18n, ready]`.
 */
export function useTranslation(ns: string | string[] = NAMESPACES[0]) {
  return useTranslationBase(ns)
}

/**
 * Ручное управление языком через localStorage.
 * Читает/записывает значение в localStorage по ключу `mai.lang`.
 */
export function useCurrentLanguage(): {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => Promise<void>
  supported: readonly AppLanguage[]
} {
  const [language, setLanguageState] = useState<AppLanguage>(() => resolveInitialLanguage())
  const setLanguage = useCallback(async (lang: AppLanguage) => {
    await i18next.changeLanguage(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    setLanguageState(lang)
  }, [])

  return useMemo(
    () => ({ language, setLanguage, supported: SUPPORTED_LANGUAGES }),
    [language, setLanguage],
  )
}
