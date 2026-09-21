import type { AppConfig, ModeConfig } from './schema'

const defaultModeConfig: ModeConfig = {
  debug: false,
  fakeData: false,
  hotReload: false,
}

/** Настройки development — зеркало `[mode.development]` из mai.toml. */
const developmentModeConfig: ModeConfig = {
  debug: true,
  fakeData: true,
  hotReload: true,
}

/**
 * Конфиг по умолчанию: используется, когда файл недоступен
 * (среда без бэкенда — браузер, Storybook, тесты) или до инициализации.
 * В development совпадает с mai.toml, чтобы в браузере (без бэкенда)
 * применялись те же настройки, что и в десктопной разработке.
 */
export const defaultConfig: AppConfig = {
  name: 'Mai',
  version: '0.0.1',
  description: 'Самообучающаяся платформа',
  mode: 'development',
  modeConfig: developmentModeConfig,
  modes: {
    development: developmentModeConfig,
    production: defaultModeConfig,
    release: defaultModeConfig,
  },
}
