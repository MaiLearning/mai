import { atom } from 'jotai'
import { fetchStructure } from '../services/fetch'
import { structureNodesAtom } from './atoms'

export const loadStructureAtom = atom(null, async (_get, set, courseId: string) => {
  const nodes = await fetchStructure(courseId)
  set(structureNodesAtom, nodes)
})
