import { loadPlugins } from '@/features/plugin'
import type { Task } from '../types'

/**
 * Загружает internal-плагины из backend и регистрирует их в рантайме.
 * Ошибки перехватываются Runner'ом и логируются.
 */
export const initPluginsTask: Task = {
  name: 'init-plugins',
  async run() {
    await loadPlugins()
  },
}
