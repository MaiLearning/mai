import { atom } from 'jotai'
import { fetchCourseLinks } from '../services/fetch'
import { linksByCourseAtom } from './atoms'

export const loadCourseLinksAtom = atom(null, async (_get, set, courseId: string) => {
  const links = await fetchCourseLinks(courseId)
  set(linksByCourseAtom, (prev) => ({ ...prev, [courseId]: links }))
})
