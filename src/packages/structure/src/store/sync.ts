import { bus } from '@mai/bus'
import type { ChangedEvent } from '@mai/sync'
import { warn } from '@mai/tauri/logs'
import type { Getter, Setter } from 'jotai'
import { atom, getDefaultStore } from 'jotai'
import { structureFlatByIdAtom } from './atoms'
import { loadStructureAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * refetchStructureIfLoaded — перечитывает дерево структуры курса штатным
 * load-атомом, но только если дерево этого курса сейчас открыто (иначе skip:
 * чужой refetch заменил бы данные другого курса).
 *
 * Общий helper приёмной стороны sync: используется applyStructureChangeAtom,
 * applyDirectoryChangeAtom и подпиской subscribeStructureBus на
 * `'resource/changed'` из `@mai/bus` (ресурсы видны в UI только в узлах
 * дерева, своего списка с загрузчиком у них нет).
 */
export async function refetchStructureIfLoaded(
  get: Getter,
  set: Setter,
  courseId: string,
): Promise<void> {
  const flat = get(structureFlatByIdAtom)
  const loadedCourseId = Object.values(flat)[0]?.courseId
  if (!loadedCourseId || loadedCourseId !== courseId) return

  await set(loadStructureAtom, courseId)
}

/**
 * applyStructureChangeAtom — приёмник внешних изменений структуры
 * (событие entity://changed, origin: http).
 *
 * Любое действие → плоский refetch дерева существующим load-атомом
 * (через refetchStructureIfLoaded). История undo/redo и optimistic-механика
 * не затрагиваются: внешний refetch только перечитывает payload с backend.
 */
export const applyStructureChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return
    await refetchStructureIfLoaded(get, set, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение структуры курса ${event.courseId}: ${formatError(e)}`)
  }
})

/**
 * applyDirectoryChangeAtom — приёмник внешних изменений папок
 * (событие entity://changed, origin: http).
 *
 * Отличие от _mai: отдельного списка папок (directoriesAtom) в mai нет —
 * папки живут узлами в дереве структуры, поэтому реакция та же, что
 * у structure: refetch дерева курса, если оно открыто.
 */
export const applyDirectoryChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return
    await refetchStructureIfLoaded(get, set, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение папок курса ${event.courseId}: ${formatError(e)}`)
  }
})

/**
 * subscribeStructureBus — подписка на факт `'resource/changed'` из `@mai/bus`.
 *
 * Ресурсы видны в UI только в узлах дерева, поэтому внешнее изменение
 * ресурса — это refetch дерева курса (если оно открыто), через
 * refetchStructureIfLoaded. Guard «курс открыт» внутри helper'а.
 *
 * Сайд-эффект включается явно на композиционном слое (init-events),
 * а не на импорте модуля. Возвращает отписку.
 */
export function subscribeStructureBus(): () => void {
  const store = getDefaultStore()

  return bus.on('resource/changed', (event) => {
    if (!event.courseId) return

    try {
      const result = refetchStructureIfLoaded(store.get, store.set, event.courseId)
      if (result instanceof Promise) {
        result.catch((e) => {
          warn(`Не удалось применить изменение ресурса ${event.id}: ${formatError(e)}`)
        })
      }
    } catch (e) {
      warn(`Не удалось применить изменение ресурса ${event.id}: ${formatError(e)}`)
    }
  })
}
