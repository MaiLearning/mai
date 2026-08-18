import { atom } from 'jotai'
import { renameDirectory } from '../services/update'
import { directoriesAtom } from './atoms'

export const renameDirectoryAtom = atom(
  null,
  async (_get, set, input: { nodeId: string; name: string }) => {
    await renameDirectory(input.nodeId, input.name)
    set(directoriesAtom, (prev) =>
      prev.map((d) => (d.id === input.nodeId ? { ...d, name: input.name } : d)),
    )
  },
)
