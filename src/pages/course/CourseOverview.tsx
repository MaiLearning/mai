import { selectCourseAtom } from '@mai/course'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Hint, Kicker, Lead, Overview, Title } from './CourseOverview.style'

/**
 * CourseOverview — обзор курса (index-роут /course/:courseId).
 *
 * Данные читаются из store сущности course (coursesByIdAtom).
 * Навигация по материалам — через sidebar в шелле; просмотр
 * ресурса — роут resource/:resourceId с Viewer.
 */
export function CourseOverview() {
  const { courseId } = useParams<{ courseId: string }>()
  const selectCourse = useMemo(() => selectCourseAtom(courseId ?? ''), [courseId])
  const course = useAtomValue(selectCourse)

  if (!course) {
    return (
      <Overview>
        <Hint color="muted">Курс не найден.</Hint>
      </Overview>
    )
  }

  return (
    <Overview>
      <Kicker>Курс</Kicker>
      <Title>{course.name}</Title>
      <Lead>{course.description ?? 'Описание пока не заполнено.'}</Lead>
      <Hint color="muted">Выберите материал в содержании слева, чтобы продолжить.</Hint>
    </Overview>
  )
}
