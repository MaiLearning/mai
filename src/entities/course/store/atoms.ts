import { type Atom, atom } from 'jotai'
import type { Course } from '../core/model'

export const coursesAtom = atom<Course[]>([])
export const selectedCourseIdAtom = atom<string | null>(null)

/**
 * Кэш курсов по id. Наполняется точечно через loadCourseByIdAtom
 * (в отличие от coursesAtom, который грузит весь список).
 */
export const coursesByIdAtom = atom<Record<string, Course>>({})

const selectCourseCache = new Map<string, Atom<Course | null>>()

/**
 * Производный атом чтения курса по id из кэша coursesByIdAtom.
 * Фабрика мемоизирована: один id — один атом (стабильная ссылка для хуков).
 */
export function selectCourseAtom(courseId: string): Atom<Course | null> {
  let target = selectCourseCache.get(courseId)
  if (!target) {
    target = atom((get) => get(coursesByIdAtom)[courseId] ?? null)
    selectCourseCache.set(courseId, target)
  }
  return target
}

export const selectedCourseAtom = atom((get) => {
  const id = get(selectedCourseIdAtom)
  const courses = get(coursesAtom)
  return courses.find((c) => c.id === id) ?? null
})
