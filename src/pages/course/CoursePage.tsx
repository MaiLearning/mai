import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { selectCourseAtom } from '@/entities/course/store'
import { Hint, Kicker, Lead, Overview, Title } from './course-overview.styles'

/**
 * CoursePage — обзор курса (index-роут /course/:courseId).
 *
 * Данные читаются из store сущности course (coursesByIdAtom).
 * Навигация по материалам — через sidebar в layout; просмотр
 * ресурса — роут resource/:resourceId с Viewer.
 */
export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const selectCourse = useMemo(() => selectCourseAtom(courseId ?? ''), [courseId])
  const course = useAtomValue(selectCourse)

  if (!course) {
    return (
      <Overview>
        <Hint muted>Курс не найден.</Hint>
      </Overview>
    )
  }

  return (
    <Overview>
      <Kicker>Курс</Kicker>
      <Title>{course.name}</Title>
      <Lead>{course.description ?? 'Описание пока не заполнено.'}</Lead>
      <Hint muted>Выберите материал в содержании слева, чтобы продолжить.</Hint>
    </Overview>
  )
}
