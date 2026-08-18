import { atom } from 'jotai'
import { deleteDirectory } from '../services/delete'
import { directoriesAtom } from './atoms'

export const deleteDirectoryAtom = atom(null, async (_get, set, nodeId: string) => {
  await deleteDirectory(nodeId)
  set(directoriesAtom, (prev) => prev.filter((d) => d.id !== nodeId))
})
