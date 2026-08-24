import type { Course } from './model'

/**
 * Резолвит continue-курс для домашней страницы:
 * 1. последний открытый (lastOpenedId), если курс ещё существует;
 * 2. иначе самый свежий in_progress;
 * 3. иначе просто самый свежий по updatedAt.
 */
export function resolveContinueCourse(
  courses: Course[],
  lastOpenedId: string | null,
): Course | null {
  if (courses.length === 0) return null

  if (lastOpenedId) {
    const opened = courses.find((course) => course.id === lastOpenedId)
    if (opened) return opened
  }

  const byFreshness = [...courses].sort((a, b) => b.updatedAt - a.updatedAt)
  return byFreshness.find((course) => course.status === 'in_progress') ?? byFreshness[0]
}
