import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/entities/sync/protocol'
import { directoriesAtom } from './atoms'
import { loadDirectoriesAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyDirectoryChangeAtom — приёмник внешних изменений папок
 * (событие entity://changed, origin: http).
 *
 * Любое действие → refetch списка папок курса существующим fetch-атомом.
 * Список другого (не открытого) курса не перечитываем: load-атом заменяет
 * directoriesAtom целиком, чужой refetch испортил бы данные.
 */
export const applyDirectoryChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return

    const loadedCourseId = get(directoriesAtom)[0]?.courseId
    if (!loadedCourseId || loadedCourseId !== event.courseId) return

    await set(loadDirectoriesAtom, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение папок курса ${event.courseId}: ${formatError(e)}`)
  }
})
