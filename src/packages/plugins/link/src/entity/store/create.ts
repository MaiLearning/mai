import { error as logError } from '@mai/tauri/logs'
import { atom } from 'jotai'
import type { CreateLinkInput, Link } from '../core/model'
import { createLink } from '../services/create'
import { linksByCourseAtom } from './atoms'

function formatError(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * createLinkAtom — создание ссылки и дописывание её в запись курса.
 *
 * Ошибку логирует и пробрасывает дальше (компонент показывает toast).
 */
export const createLinkAtom = atom(
  null,
  async (_get, set, input: { courseId: string; input: CreateLinkInput }): Promise<Link> => {
    try {
      const link = await createLink(input.input)
      set(linksByCourseAtom, (prev) => ({
        ...prev,
        [input.courseId]: [...(prev[input.courseId] ?? []), link],
      }))

      return link
    } catch (e) {
      logError(`Не удалось создать ссылку курса ${input.courseId}: ${formatError(e)}`)
      throw e
    }
  },
)
