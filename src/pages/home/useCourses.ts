import { useCallback, useEffect, useState } from 'react'
import type { Course } from '@/entities/course'
import { fetchAllCourses } from '@/entities/course/services'
import { fetchStructure } from '@/entities/structure/services'

interface UseCoursesResult {
  courses: Course[]
  /** Кол-во уроков (нод-ресурсов) по courseId. */
  lessonCounts: Record<string, number>
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * Загружает список курсов и для каждого — кол-во уроков из структуры.
 * Структуру читает напрямую через сервис (не через loadStructureAtom),
 * чтобы не затирать глобальный атом структуры открытого курса.
 */
export function useCourses(): UseCoursesResult {
  const [courses, setCourses] = useState<Course[]>([])
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await fetchAllCourses()
      setCourses(list)
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

  return { courses, lessonCounts, loading, error, reload: load }
}
