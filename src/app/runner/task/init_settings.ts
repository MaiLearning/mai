import { applyLanguage } from '@mai/i18n'
import {
  initSystemSettings,
  settingsReadyAtom,
  systemLanguageAtom,
  systemThemeAtom,
} from '@mai/settings'
import { info } from '@mai/tauri/logs'
import { getDefaultStore } from 'jotai'
import type { Task } from '../types'

/**
 * Инициализация системных настроек: загрузка пункта «Общие» и применение
 * к потребителям. Тема применяется реактивно (app.tsx читает атом);
 * язык — императивно, т.к. i18next живёт вне React, и подписан на изменения.
 * По завершении выставляется готовность настроек: до этого рендер приостановлен.
 */
export const initSettingsTask: Task = {
  name: 'init-settings',
  async run() {
    const store = getDefaultStore()
    await initSystemSettings()

    applyLanguage(store.get(systemLanguageAtom))
    store.sub(systemLanguageAtom, () => {
      applyLanguage(store.get(systemLanguageAtom))
    })

    store.set(settingsReadyAtom, true)
    info(
      `Системные настройки загружены: тема ${store.get(systemThemeAtom)}, язык ${store.get(systemLanguageAtom)}`,
    )
  },
}
