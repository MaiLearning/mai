import { atom } from 'jotai'
import { fetchAllCourses } from '../services/fetch'
import { coursesAtom } from './atoms'

export const loadCoursesAtom = atom(null, async (_get, set) => {
  const courses = await fetchAllCourses()
  set(coursesAtom, courses)
})
