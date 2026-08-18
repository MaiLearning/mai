import { initLogger } from '@/utils/logger'
import type { Task } from '../types'

export const initLoggerTask: Task = {
  name: 'init-logger',
  async run() {
    await initLogger()
  },
}
