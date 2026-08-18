import rawConfig from 'virtual:mai-config'
import type { AppMode } from './runner'

export interface AppConfig {
  mode: AppMode
  plugins: string[]
  logging: string
}

const modes: AppMode[] = ['development', 'production', 'release']

if (!modes.includes(rawConfig.mode as AppMode)) {
  throw new Error(`Неподдерживаемый режим приложения: ${rawConfig.mode}`)
}

export const appConfig: AppConfig = {
  mode: rawConfig.mode as AppMode,
  plugins: rawConfig.plugins,
  logging: rawConfig.logging,
}
