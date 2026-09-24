import { useTranslation } from '@mai/i18n'
import { Alert, Button, Heading, Spinner, Text } from '@mai/theme'
import type { Course } from '../../core'
import {
  CourseHero,
  CourseSectionLoading,
  CoursesSection as Section,
  SectionHead,
  SectionTitles,
} from './CoursesSection.style'
import { CourseLibrary } from './courseLibrary/CourseLibrary'
import { FeaturedCourseCard } from './featuredCourseCard/FeaturedCourseCard'

/** Максимальное число карточек курсов на главной странице. */
const MAX_VISIBLE_COURSES = 12

interface CoursesSectionProps {
  courses: Course[]
  lessonCounts: Record<string, number>
  /** Курс для главной карточки: последний открытый, иначе самый свежий. */
  continueCourse: Course | null
  loading: boolean
  error: string | null
  reload: () => void
  /** Открыть модальное окно создания курса. */
  onCreateCourse: () => void
  /** Открыть модальное окно настроек курса. */
  onEditCourse: (course: Course) => void
  /** Открыть курс (навигацию выполняет потребитель). */
  onOpenCourse: (course: Course) => void
  /** Перейти к управлению курсами (навигацию выполняет потребитель). */
  onManageCourses: () => void
}

export function CoursesSection({
  courses,
  lessonCounts,
  continueCourse,
  loading,
  error,
  reload,
  onCreateCourse,
  onEditCourse,
  onOpenCourse,
  onManageCourses,
}: CoursesSectionProps) {
  const { t } = useTranslation('course')
  const { t: th } = useTranslation('home')

  // На главной показываем не больше MAX_VISIBLE_COURSES карточек;
  // continue-курс живёт в hero и из библиотеки исключается.
  const visibleCourses = courses.slice(0, MAX_VISIBLE_COURSES)
  const gridCourses = continueCourse
    ? visibleCourses.filter((course) => course.id !== continueCourse.id)
    : visibleCourses
  const hasMore = courses.length > MAX_VISIBLE_COURSES

  return (
    <Section>
      <SectionHead>
        <SectionTitles>
          <Heading as="h2" size="lg" id="courses">
            {th('learning.title')}
          </Heading>
          <Text as="p" size="sm" color="muted">
            {th('learning.subtitle')}
          </Text>
        </SectionTitles>
      </SectionHead>

      {loading && (
        <CourseSectionLoading>
          <Spinner />
        </CourseSectionLoading>
      )}

      {!loading && error && (
        <Alert variant="error">
          {t('error.loadFailed', { error })}
          <Button variant="ghost" size="sm" type="button" onClick={reload}>
            {t('error.retry')}
          </Button>
        </Alert>
      )}

      {!loading && !error && (
        <>
          {continueCourse && (
            <CourseHero>
              <FeaturedCourseCard
                course={continueCourse}
                lessonsTotal={lessonCounts[continueCourse.id]}
                // TODO: подключить реальные данные прогресса (текущий урок, позиция, время открытия)
                currentLessonTitle="Урок 16: Generic constraints"
                currentLessonIndex={16}
                lastOpenedLabel="Открывали сегодня в 10:42"
                onOpen={onOpenCourse}
                onEdit={onEditCourse}
              />
            </CourseHero>
          )}
          <CourseLibrary
            courses={gridCourses}
            lessonCounts={lessonCounts}
            onCreateCourse={onCreateCourse}
            onEditCourse={onEditCourse}
            onOpenCourse={onOpenCourse}
          />
          {hasMore && (
            <Button variant="secondary" type="button" onClick={onManageCourses}>
              {t('coursesSection.library')}
            </Button>
          )}
        </>
      )}
    </Section>
  )
}
