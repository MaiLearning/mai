import { configReadyAtom, getAppConfig, initAppConfig } from '@mai/config'
import { configureFakeData } from '@mai/fakeData'
import { info } from '@mai/tauri/logs'
import { getDefaultStore } from 'jotai'
import type { Task } from '../types'

/**
 * Инициализация единого конфига проекта (mai.toml): первичное чтение
 * через invoke + подписка на события изменения. Здесь же конфигурируются
 * первые потребители конфига — fake-данные. По завершении выставляется
 * готовность конфига: до этого рендер приложения приостановлен.
 */
export const initConfigTask: Task = {
  name: 'init-config',
  async run() {
    await initAppConfig()

    const config = getAppConfig()
    if (import.meta.env.DEV) {
      configureFakeData({ mode: config.mode, fakeData: config.modeConfig.fakeData })
    }
    getDefaultStore().set(configReadyAtom, true)
    info(`Конфиг загружен: режим ${config.mode}`)
  },
}
