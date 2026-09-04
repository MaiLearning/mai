import { error as logError } from '@tauri-apps/plugin-log'
import { atom } from 'jotai'
import type { Link, UpdateLinkInput } from '../core/model'
import { updateLink } from '../services/update'
import { linksByCourseAtom } from './atoms'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * updateLinkAtom — замена ребра в той записи курса, где оно лежит.
 * Ошибка логируется и пробрасывается дальше.
 */
export const updateLinkAtom = atom(
  null,
  async (_get, set, input: UpdateLinkInput): Promise<Link> => {
    try {
      const updated = await updateLink(input)
      set(linksByCourseAtom, (prev) => {
        const next: Record<string, Link[]> = {}
        for (const [courseId, links] of Object.entries(prev)) {
          next[courseId] = links.some((link) => link.id === updated.id)
            ? links.map((link) => (link.id === updated.id ? updated : link))
            : links
        }

        return next
      })

      return updated
    } catch (e) {
      logError(`Не удалось обновить ссылку ${input.id}: ${formatError(e)}`)
      throw e
    }
  },
)
