import { info } from '@tauri-apps/plugin-log'
import { getDefaultStore } from 'jotai'
import { i18next } from '@/app/i18n/init'
import { DEFAULT_SETTINGS, loadSettingsAtom, settingsAtom } from '@/entities/settings'
import type { Task } from '../types'

/**
 * Загрузка настроек при старте приложения и применение языка: если
 * сохранённый язык расходится со стартовым, переключает i18next.
 * Тема применяется реактивно через ThemeProvider.
 *
 * Пока настройки живут в in-memory хранилище, значение по умолчанию —
 * не выбор пользователя: его не применяем, стартовым остаётся язык из
 * boot-кэша (`mai.lang`), который i18next уже применил при инициализации.
 * С появлением backend-персистенции условие снимается — настройка
 * становится авторитетной всегда.
 */
export const initSettingsTask: Task = {
  name: 'init-settings',
  async run() {
    const store = getDefaultStore()
    await store.set(loadSettingsAtom)

    const settings = store.get(settingsAtom)
    if (!settings) return

    info(`Настройки загружены: theme=${settings.theme}, language=${settings.language}`)

    const isUserChoice = settings.language !== DEFAULT_SETTINGS.language
    if (isUserChoice && settings.language !== i18next.language) {
      await i18next.changeLanguage(settings.language)
      info(`Язык интерфейса синхронизирован с настройками: ${settings.language}`)
    }
  },
}
