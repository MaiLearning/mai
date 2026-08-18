import { atom } from 'jotai'
import type { Course } from '../core/model'

export const coursesAtom = atom<Course[]>([])
export const selectedCourseIdAtom = atom<string | null>(null)

export const selectedCourseAtom = atom((get) => {
  const id = get(selectedCourseIdAtom)
  const courses = get(coursesAtom)
  return courses.find((c) => c.id === id) ?? null
})
