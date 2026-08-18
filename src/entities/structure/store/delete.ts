import { atom } from 'jotai'
import { deleteNode } from '../services/delete'
import { structureNodesAtom } from './atoms'

export const deleteNodeAtom = atom(null, async (_get, set, nodeId: string) => {
  await deleteNode(nodeId)
  set(structureNodesAtom, (prev) => prev.filter((n) => n.id !== nodeId))
})
