import { atom } from 'jotai'
import { clearTheoryContent, deleteTheoryContent } from '../services/delete'
import { theoryContentsAtom } from './atoms'

export const clearTheoryContentAtom = atom(null, async (_get, set, resourceId: string) => {
  const cleared = await clearTheoryContent(resourceId)
  set(theoryContentsAtom, (prev) => {
    const filtered = prev.filter((c) => c.resourceId !== resourceId)

    return [...filtered, cleared]
  })
})

export const deleteTheoryContentAtom = atom(null, async (_get, set, resourceId: string) => {
  await deleteTheoryContent(resourceId)
  set(theoryContentsAtom, (prev) => prev.filter((c) => c.resourceId !== resourceId))
})
