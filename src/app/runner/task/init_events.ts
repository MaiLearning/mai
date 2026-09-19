import { applyCourseChangeAtom } from '@mai/course'
import { isFakeDataEnabled } from '@mai/fakeData'
import { applyPluginChangeAtom } from '@mai/plugin'
import { applyResourceChangeAtom, applyResourceTypeChangeAtom } from '@mai/resource'
import {
  applyDirectoryChangeAtom,
  applyStructureChangeAtom,
  subscribeStructureBus,
} from '@mai/structure'
import { createEventDispatcher } from '@mai/sync'
import { applyLinkChangeAtom } from '@mai-plugin/link'
import { listen } from '@tauri-apps/api/event'
import type { Task } from '../types'

/**
 * Подписка на backend-события `entity://changed` (одна на приложение).
 * Реестр «сущность → applier» собирается здесь, на композиционном слое:
 * механизм в @mai/sync не знает о конкретных сущностях.
 * Здесь же включаются межпакетные подписки @mai/bus (пакеты друг
 * о друге не знают — связи собирает только композиция).
 * В fake-режиме backend-событий нет — таска no-op.
 */
export const initEventsTask: Task = {
  name: 'init-events',
  async run() {
    if (isFakeDataEnabled()) return

    subscribeStructureBus()

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
