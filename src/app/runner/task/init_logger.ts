import { initLogger } from '@mai/tauri/logs'
import type { Task } from '../types'

/** Таска инициализации логгера — attachConsole к Tauri plugin-log. */
export const initLoggerTask: Task = {
  name: 'init-logger',
  async run() {
    await initLogger()
    console.log('[Runner] Logger готов')
  },
}
