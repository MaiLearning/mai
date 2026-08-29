import { atom } from 'jotai'
import type { SaveTaskContentInput } from '../core/model'
import { saveTaskContent } from '../services/create'
import { taskContentsAtom } from './atoms'

export const saveTaskContentAtom = atom(null, async (_get, set, input: SaveTaskContentInput) => {
  const saved = await saveTaskContent(input)
  set(taskContentsAtom, (prev) => {
    const filtered = prev.filter((c) => c.resourceId !== input.resourceId)

    return [...filtered, saved]
  })

  return saved
})
