import { atom } from 'jotai'
import type { CreateCourseInput } from '../core/model'
import { createCourse } from '../services/create'
import { coursesAtom } from './atoms'

export const createCourseAtom = atom(null, async (_get, set, input: CreateCourseInput) => {
  const course = await createCourse(input)
  set(coursesAtom, (prev) => [...prev, course])

  return course
})
