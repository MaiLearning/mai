import { atom } from 'jotai'
import { fetchDirectories } from '../services/fetch'
import { directoriesAtom } from './atoms'

export const loadDirectoriesAtom = atom(null, async (_get, set, courseId: string) => {
  const directories = await fetchDirectories(courseId)
  set(directoriesAtom, directories)
})
