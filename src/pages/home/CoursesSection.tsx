import { Pencil } from 'lucide-react'
import { useTranslation } from '@/app/i18n'
import { Alert, ProgressFill, ProgressTrack, Spinner } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import { mix, readableOn } from '@/features/course-modal'
import {
  CardBody,
  CardCover,
  CardDescription,
  CardFoot,
  CardMetaRow,
  CourseCard,
  CourseGrid,
  CoverEditButton,
  CoverTag,
  CoverTags,
  CreateCard,
  CreateIcon,
  CoursesSection as Section,
  SectionHead,
  StatusBadge,
} from './CoursesSection.styles'
import { HomeIcon } from './HomeIcon'
import { ActionLink } from './shared.styles'

const DEFAULT_COLOR_FROM = '#6a54ff'
const DEFAULT_COLOR_TO = '#9d7bff'

/** Максимальное число карточек курсов на главной странице. */
const MAX_VISIBLE_COURSES = 12

interface CoursesSectionProps {
  courses: Course[]
  lessonCounts: Record<string, number>
  loading: boolean
  error: string | null
  reload: () => void
  /** Открыть модальное окно создания курса. */
  onCreateCourse: () => void
  /** Открыть модальное окно настроек курса. */
  onEditCourse: (course: Course) => void
}

export function CoursesSection({
  courses,
  lessonCounts,
  loading,
  error,
  reload,
  onCreateCourse,
  onEditCourse,
}: CoursesSectionProps) {
  const { t } = useTranslation('home')

  // На главной показываем не больше MAX_VISIBLE_COURSES карточек
  const visibleCourses = courses.slice(0, MAX_VISIBLE_COURSES)
  const hasMore = courses.length > MAX_VISIBLE_COURSES

  return (
    <Section>
      <SectionHead>
        <div>
          <h2>{t('coursesSection.title')}</h2>
          <p>{t('coursesSection.subtitle')}</p>
        </div>
        <ActionLink to="/courses" $variant="soft">
          {t('coursesSection.manage')}
        </ActionLink>
      </SectionHead>

      {loading && (
        <div style={{ display: 'grid', placeItems: 'center', padding: 48 }}>
          <Spinner />
        </div>
      )}

      {!loading && error && (
        <Alert variant="error">
          {t('error.loadFailed', { error })}
          <ActionLink
            to="/home"
            $variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              reload()
            }}
          >
            {t('error.retry')}
          </ActionLink>
        </Alert>
      )}

      {!loading && !error && (
        <>
          <CourseGrid>
            {visibleCourses.map((course) => {
              const lessons = lessonCounts[course.id]
              const from = course.colorFrom ?? DEFAULT_COLOR_FROM
              const to = course.colorTo ?? DEFAULT_COLOR_TO
              const ink = readableOn(mix(from, to, 0.5))

              return (
                <CourseCard key={course.id}>
                  <CardCover $from={from} $to={to} $ink={ink}>
                    <CoverTags>
                      {course.tags.map((tag) => (
                        <CoverTag key={tag} $ink={ink}>
                          {tag}
                        </CoverTag>
                      ))}
                    </CoverTags>
                    <CoverEditButton
                      type="button"
                      aria-label={t('coursesSection.cards.settings')}
                      onClick={() => onEditCourse(course)}
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </CoverEditButton>
                  </CardCover>
                  <CardBody>
                    <h3>{course.name}</h3>
                    {course.description && <CardDescription>{course.description}</CardDescription>}
                    <CardMetaRow>
                      <StatusBadge $status={course.status}>
                        {t(`coursesSection.cards.status.${course.status}`)}
                      </StatusBadge>
                      {lessons !== undefined && (
                        <span>{t('coursesSection.cards.resources', { count: lessons })}</span>
                      )}
                    </CardMetaRow>
                    <CardFoot>
                      <div className="row">
                        {/* Прогресс-трекинга пока нет — показываем 0% (follow-up) */}
                        <span>{t('coursesSection.cards.percentComplete', { percent: 0 })}</span>
                        <ActionLink to={`/course/${course.id}`}>
                          {t('coursesSection.cards.open')} <HomeIcon name="arrow" size={13} />
                        </ActionLink>
                      </div>
                      <ProgressTrack
                        role="progressbar"
                        aria-valuenow={0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <ProgressFill $percent={0} />
                      </ProgressTrack>
                    </CardFoot>
                  </CardBody>
                </CourseCard>
              )
            })}
            <CreateCard type="button" onClick={onCreateCourse}>
              <CreateIcon>
                <HomeIcon name="plus" size={24} />
              </CreateIcon>
              <strong>{t('coursesSection.createCard.title')}</strong>
              <span>{t('coursesSection.createCard.subtitle')}</span>
            </CreateCard>
          </CourseGrid>
          {hasMore && (
            <ActionLink to="/courses" $variant="soft">
              {t('coursesSection.library')}
            </ActionLink>
          )}
        </>
      )}
    </Section>
  )
}
