import { error as logError } from '@tauri-apps/plugin-log'
import { useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { useTranslation as useTranslationBase } from 'react-i18next'
import { updateSettingsAtom } from '@/entities/settings'
import { notifyError } from '@/utils/notifications'
import {
  type AppLanguage,
  LANGUAGE_STORAGE_KEY,
  NAMESPACES,
  resolveInitialLanguage,
  SUPPORTED_LANGUAGES,
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
 * Управление языком через настройки приложения (сохранение — сущность
 * settings). Читаемое значение — фактический язык i18next (применённый):
 * до появления backend-персистенции загруженные из памяти дефолты
 * не должны затенять стартовый язык из boot-кэша.
 * Смена языка сохраняет настройку, переключает i18next и обновляет boot-кэш.
 */
export function useCurrentLanguage(): {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => Promise<void>
  supported: readonly AppLanguage[]
} {
  const updateSettings = useSetAtom(updateSettingsAtom)
  const language = (i18next.language as AppLanguage | undefined) ?? resolveInitialLanguage()

  const setLanguage = useCallback(
    async (lang: AppLanguage) => {
      try {
        await updateSettings({ language: lang })
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        logError(`Не удалось сохранить язык ${lang}: ${message}`)
        notifyError('Не удалось сохранить язык')

        return
      }

      await i18next.changeLanguage(lang)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    },
    [updateSettings],
  )

  return useMemo(
    () => ({ language, setLanguage, supported: SUPPORTED_LANGUAGES }),
    [language, setLanguage],
  )
}
