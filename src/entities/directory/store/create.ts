import { atom } from 'jotai'
import { createDirectory } from '../services/create'
import { directoriesAtom } from './atoms'

export const createDirectoryAtom = atom(
  null,
  async (_get, set, input: { courseId: string; name: string; parentId?: string | null }) => {
    const directory = await createDirectory({ ...input, parentId: input.parentId ?? null })
    set(directoriesAtom, (prev) => [...prev, directory])

    return directory
  },
)
