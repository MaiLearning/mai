import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/entities/sync/protocol'
import { coursesAtom, coursesByIdAtom, selectedCourseIdAtom } from './atoms'
import { loadCourseByIdAtom, loadCoursesAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyCourseChangeAtom — приёмник внешних изменений курса (событие
 * entity://changed, origin: http).
 *
 * created/updated → refetch списка; если курс уже лежит в точечном кэше —
 * точечный refetch его записи. deleted → удаление из списков и кэша
 * (семантика как в deleteCourseAtom, включая сброс selectedCourseIdAtom).
 */
export const applyCourseChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (event.action === 'deleted') {
      set(coursesAtom, (prev) => prev.filter((c) => c.id !== event.id))
      set(coursesByIdAtom, (prev) => {
        if (!(event.id in prev)) return prev
        const next = { ...prev }
        delete next[event.id]

        return next
      })
      if (get(selectedCourseIdAtom) === event.id) {
        set(selectedCourseIdAtom, null)
      }

      return
    }

    await set(loadCoursesAtom)
    if (event.id in get(coursesByIdAtom)) {
      await set(loadCourseByIdAtom, event.id)
    }
  } catch (e) {
    warn(`Не удалось применить изменение курса ${event.id}: ${formatError(e)}`)
  }
})
