import { initI18n } from '@/app/i18n'
import type { Task } from '../types'

export const initI18nTask: Task = {
  name: 'init-i18n',
  async run() {
    try {
      await initI18n()
      console.info('[Runner] i18n initialized')
    } catch (error) {
      console.error('[Runner] i18n init failed:', error)
      throw error
    }
  },
}
