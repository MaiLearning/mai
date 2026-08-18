import { atom } from 'jotai'
import { moveNode } from '../services/update'
import { structureNodesAtom } from './atoms'

export const moveNodeAtom = atom(
  null,
  async (_get, set, input: { nodeId: string; newParentId: string | null; position: number }) => {
    await moveNode(input.nodeId, input.newParentId, input.position)
    set(structureNodesAtom, (prev) =>
      prev.map((n) =>
        n.id === input.nodeId ? { ...n, parentId: input.newParentId, position: input.position } : n,
      ),
    )
  },
)
