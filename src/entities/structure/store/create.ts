import { atom } from 'jotai'
import { createResourceInStructure } from '../services/create'
import { structureNodesAtom } from './atoms'

export const createResourceInStructureAtom = atom(
  null,
  async (
    _get,
    set,
    input: { courseId: string; name: string; parentId?: string | null; typeKey?: string | null },
  ) => {
    const node = await createResourceInStructure({
      ...input,
      parentId: input.parentId ?? null,
      typeKey: input.typeKey ?? null,
    })
    set(structureNodesAtom, (prev) => [...prev, node])
    return node
  },
)
