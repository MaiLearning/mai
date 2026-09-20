import { getAppConfig, initAppConfig } from '@mai/config'
import { configureFakeData } from '@mai/fakeData'
import { info } from '@mai/tauri/logs'
import type { Task } from '../types'

/**
 * Инициализация единого конфига проекта (mai.toml): первичное чтение
 * через invoke + подписка на события изменения. Здесь же конфигурируются
 * первые потребители конфига — fake-данные.
 */
export const initConfigTask: Task = {
  name: 'init-config',
  async run() {
    await initAppConfig()

    const config = getAppConfig()
    configureFakeData({ mode: config.mode, fakeData: config.modeConfig.fakeData })
    info(`Конфиг загружен: режим ${config.mode}`)
  },
}
