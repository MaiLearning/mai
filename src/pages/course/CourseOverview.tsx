import { selectCourseAtom } from '@mai/course'
import { Alert } from '@mai/theme'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Kicker, Lead, Overview, Title } from './CourseOverview.style'

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
        <Alert variant="warning">Курс не найден.</Alert>
      </Overview>
    )
  }

  return (
    <Overview>
      <Kicker>Курс</Kicker>
      <Title>{course.name}</Title>
      <Lead>{course.description ?? 'Описание пока не заполнено.'}</Lead>
      <Alert variant="info">Выберите материал в содержании слева, чтобы продолжить.</Alert>
    </Overview>
  )
}
