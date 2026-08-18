import type { Task } from '../types'
import { initLogger } from '@/utils/logger'

export const initLoggerTask: Task = {
  name: 'init-logger',
  async run() {
    await initLogger()
  },
}
