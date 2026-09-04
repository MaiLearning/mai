import { listen } from '@tauri-apps/api/event'
import { applyCourseChangeAtom } from '@/entities/course'
import { applyDirectoryChangeAtom } from '@/entities/directory'
import { applyLinkChangeAtom } from '@/entities/link'
import { applyPluginChangeAtom } from '@/entities/plugins'
import { applyResourceChangeAtom, applyResourceTypeChangeAtom } from '@/entities/resource'
import { applyStructureChangeAtom } from '@/entities/structure'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { createEventDispatcher } from '@/utils/sync'
import type { Task } from '../types'

/**
 * Подписка на backend-события `entity://changed` (одна на приложение).
 * Реестр «сущность → applier» собирается здесь, на композиционном слое:
 * механизм в utils/sync не знает о конкретных сущностях.
 * В fake-режиме backend-событий нет — таска no-op.
 */
export const initEventsTask: Task = {
  name: 'init-events',
  async run() {
    if (isFakeDataEnabled) return

    const dispatchChangedEvent = createEventDispatcher({
      course: applyCourseChangeAtom,
      structure: applyStructureChangeAtom,
      directory: applyDirectoryChangeAtom,
      resource: applyResourceChangeAtom,
      resourceType: applyResourceTypeChangeAtom,
      plugin: applyPluginChangeAtom,
      link: applyLinkChangeAtom,
    })

    await listen('entity://changed', (event) => {
      dispatchChangedEvent(event.payload)
    })
  },
}
