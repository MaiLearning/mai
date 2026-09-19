import { atom } from 'jotai'
import { saveTheoryContent } from '../services/create'
import { theoryContentsAtom } from './atoms'

export const saveTheoryContentAtom = atom(
  null,
  async (_get, set, input: { resourceId: string; content: Record<string, unknown> }) => {
    const saved = await saveTheoryContent(input)
    set(theoryContentsAtom, (prev) => {
      const filtered = prev.filter((c) => c.resourceId !== input.resourceId)

      return [...filtered, saved]
    })

    return saved
  },
)
