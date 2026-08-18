import { atom } from 'jotai'
import { fetchTheoryContent } from '../services/fetch'
import { theoryContentsAtom } from './atoms'

export const loadTheoryContentAtom = atom(null, async (_get, set, resourceId: string) => {
  const content = await fetchTheoryContent(resourceId)
  set(theoryContentsAtom, (prev) => {
    const filtered = prev.filter((c) => c.resourceId !== resourceId)
    return [...filtered, content]
  })
})
