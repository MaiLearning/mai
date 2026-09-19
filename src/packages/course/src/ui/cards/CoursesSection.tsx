import { useTranslation } from '@mai/i18n'
import { Alert, Spinner } from '@mai/theme'
import type { Course } from '../../core'
import { CoursesSection as Section, SectionHead } from './CoursesSection.style'
import { CourseLibrary } from './courseLibrary/CourseLibrary'
import { FeaturedCourseCard } from './featuredCourseCard/FeaturedCourseCard'
import { SectionLink } from './shared.style'

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
        <div>
          <h2 id="courses">{th('learning.title')}</h2>
          <p>{th('learning.subtitle')}</p>
        </div>
      </SectionHead>

      {loading && (
        <div style={{ display: 'grid', placeItems: 'center', padding: 48 }}>
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <Alert variant="error">
          {t('error.loadFailed', { error })}
          <SectionLink type="button" $variant="ghost" onClick={reload}>
            {t('error.retry')}
          </SectionLink>
        </Alert>
      )}

      {!loading && !error && (
        <>
          {continueCourse && (
            <div style={{ marginBottom: 20 }}>
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
            </div>
          )}
          <CourseLibrary
            courses={gridCourses}
            lessonCounts={lessonCounts}
            onCreateCourse={onCreateCourse}
            onEditCourse={onEditCourse}
            onOpenCourse={onOpenCourse}
          />
          {hasMore && (
            <SectionLink type="button" $variant="soft" onClick={onManageCourses}>
              {t('coursesSection.library')}
            </SectionLink>
          )}
        </>
      )}
    </Section>
  )
}
