import type { AppConfig, ModeConfig } from './schema'

const defaultModeConfig: ModeConfig = {
  debug: false,
  fakeData: false,
  hotReload: false,
}

/**
 * Конфиг по умолчанию: используется, когда файл недоступен
 * (среда без бэкенда — Storybook, тесты) или до инициализации.
 */
export const defaultConfig: AppConfig = {
  name: 'Mai',
  version: '0.0.1',
  description: 'Самообучающаяся платформа',
  mode: 'development',
  modeConfig: defaultModeConfig,
  modes: {
    development: defaultModeConfig,
    production: defaultModeConfig,
    release: defaultModeConfig,
  },
}
