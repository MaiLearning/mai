import { atom } from 'jotai'
import { fetchTaskContent } from '../services/fetch'
import { taskContentsAtom } from './atoms'

export const loadTaskContentAtom = atom(null, async (_get, set, resourceId: string) => {
  const content = await fetchTaskContent(resourceId)
  set(taskContentsAtom, (prev) => {
    const filtered = prev.filter((c) => c.resourceId !== resourceId)

    return [...filtered, content]
  })
})
