import { atom } from 'jotai'
import { clearTaskContent, deleteTaskContent } from '../services/delete'
import { taskContentsAtom } from './atoms'

export const clearTaskContentAtom = atom(null, async (_get, set, resourceId: string) => {
  const cleared = await clearTaskContent(resourceId)
  set(taskContentsAtom, (prev) => {
    const filtered = prev.filter((c) => c.resourceId !== resourceId)

    return [...filtered, cleared]
  })
})

export const deleteTaskContentAtom = atom(null, async (_get, set, resourceId: string) => {
  await deleteTaskContent(resourceId)
  set(taskContentsAtom, (prev) => prev.filter((c) => c.resourceId !== resourceId))
})
