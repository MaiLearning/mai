import { warn } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { ChangedEvent } from '@/utils/sync/protocol'
import { linksByCourseAtom } from './atoms'
import { loadCourseLinksAtom } from './fetch'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * applyLinkChangeAtom — приёмник внешних изменений ссылок
 * (событие entity://changed, origin: http).
 *
 * Если список ссылок курса уже загружен — refetch его записи существующим
 * load-атомом; незагруженные курсы не трогаем (не создаём лишних записей).
 */
export const applyLinkChangeAtom = atom(null, async (get, set, event: ChangedEvent) => {
  try {
    if (!event.courseId) return
    if (!(event.courseId in get(linksByCourseAtom))) return

    await set(loadCourseLinksAtom, event.courseId)
  } catch (e) {
    warn(`Не удалось применить изменение ссылок курса ${event.courseId}: ${formatError(e)}`)
  }
})
