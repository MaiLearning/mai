import { warn } from '@tauri-apps/plugin-log'
import type { Getter, Setter } from 'jotai'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/entities/sync/protocol'
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
 * Общий helper приёмной стороны sync: используется applyStructureChangeAtom
 * и appliers сущностей, чьи изменения видны только в узлах дерева (resource).
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
