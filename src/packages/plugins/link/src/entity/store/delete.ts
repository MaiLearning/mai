import { error as logError } from '@mai/tauri/logs'
import { atom } from 'jotai'
import { deleteLink } from '../services/delete'
import { linksByCourseAtom } from './atoms'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * deleteLinkAtom — удаление ссылки из всех записей курсов.
 * Ошибка логируется и пробрасывается дальше.
 */
export const deleteLinkAtom = atom(
  null,
  async (_get, set, input: { id: string; ownerPluginId: string }): Promise<void> => {
    try {
      await deleteLink(input.id, input.ownerPluginId)
      set(linksByCourseAtom, (prev) => {
        const next: Record<string, (typeof prev)[string]> = {}
        for (const [courseId, links] of Object.entries(prev)) {
          next[courseId] = links.filter((link) => link.id !== input.id)
        }

        return next
      })
    } catch (e) {
      logError(`Не удалось удалить ссылку ${input.id}: ${formatError(e)}`)
      throw e
    }
  },
)
