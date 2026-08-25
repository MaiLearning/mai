import { useCallback, useEffect, useState } from 'react'
import type { Course } from '@/entities/course'
import { LAST_OPENED_COURSE_KEY, resolveContinueCourse } from '@/entities/course'
import { fetchAllCourses } from '@/entities/course/services'
import { getKvValue } from '@/entities/kv/services'
import { fetchStructure } from '@/entities/structure/services'

interface UseCoursesResult {
  courses: Course[]
  /** Кол-во уроков (нод-ресурсов) по courseId. */
  lessonCounts: Record<string, number>
  /** Курс для continue-карточки: последний открытый, иначе самый свежий. */
  continueCourse: Course | null
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * Загружает список курсов, для каждого — кол-во уроков из структуры и
 * id последнего открытого курса (KV-хранилище) для continue-курса.
 * Структуру читает напрямую через сервис (не через loadStructureAtom),
 * чтобы не затирать глобальный атом структуры открытого курса.
 */
export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({})
  const [continueCourse, setContinueCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [list, lastOpenedId] = await Promise.all([
        fetchAllCourses(),
        // Ошибка чтения настройки не должна ломать загрузку курсов
        getKvValue<string>(LAST_OPENED_COURSE_KEY).catch(() => null),
      ])
      setCourses(list)
      setContinueCourse(resolveContinueCourse(list, lastOpenedId))
      const counts = await Promise.all(
        list.map(async (course) => {
          const nodes = await fetchStructure(course.id)

          return [course.id, nodes.filter((node) => !node.isDirectory).length] as const
        }),
      )
      setLessonCounts(Object.fromEntries(counts))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { courses, lessonCounts, continueCourse, loading, error, reload: load }
}
