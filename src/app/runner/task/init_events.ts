import { listen } from '@tauri-apps/api/event'
import { dispatchChangedEvent } from '@/entities/sync'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import type { Task } from '../types'

/**
 * Подписка на backend-события `entity://changed` (одна на приложение).
 * В fake-режиме backend-событий нет — таска no-op.
 */
export const initEventsTask: Task = {
  name: 'init-events',
  async run() {
    if (isFakeDataEnabled) return

    await listen('entity://changed', (event) => {
      dispatchChangedEvent(event.payload)
    })
  },
}
