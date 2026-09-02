import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/entities/sync/protocol'
import { structureFlatByIdAtom } from './atoms'
import { loadStructureAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyStructureChangeAtom — приёмник внешних изменений структуры
 * (событие entity://changed, origin: http).
 *
 * Любое действие → плоский refetch дерева существующим load-атомом.
 * История undo/redo и optimistic-механика не затрагиваются: внешний
 * refetch только перечитывает payload с backend.
 * Дерево курса, который не открыт (карта пуста или courseId другой), — skip.
 */
export const applyStructureChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return

    const flat = get(structureFlatByIdAtom)
    const loadedCourseId = Object.values(flat)[0]?.courseId
    if (!loadedCourseId || loadedCourseId !== event.courseId) return

    await set(loadStructureAtom, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение структуры курса ${event.courseId}: ${formatError(e)}`)
  }
})
