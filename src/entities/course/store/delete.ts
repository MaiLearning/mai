import { atom } from 'jotai'
import { deleteCourse } from '../services/delete'
import { coursesAtom, selectedCourseIdAtom } from './atoms'

export const deleteCourseAtom = atom(null, async (get, set, id: string) => {
  await deleteCourse(id)
  set(coursesAtom, (prev) => prev.filter((c) => c.id !== id))
  if (get(selectedCourseIdAtom) === id) {
    set(selectedCourseIdAtom, null)
  }
})
