import { atom } from 'jotai'
import { fetchAllCourses, fetchCourseById } from '../services/fetch'
import { coursesAtom, coursesByIdAtom } from './atoms'

export const loadCoursesAtom = atom(null, async (_get, set) => {
  const courses = await fetchAllCourses()
  set(coursesAtom, courses)
})

/** Загружает один курс по id и кладёт в кэш coursesByIdAtom. */
export const loadCourseByIdAtom = atom(null, async (_get, set, courseId: string) => {
  const course = await fetchCourseById(courseId)
  set(coursesByIdAtom, (prev) => ({ ...prev, [course.id]: course }))
})
