import { useTranslation } from '@/app/i18n'
import { Alert, Badge, ProgressFill, ProgressTrack, Spinner } from '@/app/theme/components'
import type { Course, CourseStatus } from '@/entities/course'
import { HomeIcon } from './HomeIcon'
import {
  ActionLink,
  CardArt,
  CardBody,
  CardFoot,
  CardMeta,
  CourseCard,
  CourseGrid,
  CreateCard,
  CreateIcon,
  CoursesSection as Section,
  SectionHead,
} from './home.styles'

const DEFAULT_COLOR_FROM = '#6a54ff'
const DEFAULT_COLOR_TO = '#9d7bff'

interface CoursesSectionProps {
  courses: Course[]
  lessonCounts: Record<string, number>
  loading: boolean
  error: string | null
  reload: () => void
}

/** Маппинг статуса курса на вариант бейджа. */
const STATUS_VARIANT: Record<CourseStatus, 'neutral' | 'primary' | 'success'> = {
  draft: 'neutral',
  in_progress: 'primary',
  completed: 'success',
}

export function CoursesSection({
  courses,
  lessonCounts,
  loading,
  error,
  reload,
}: CoursesSectionProps) {
  const { t } = useTranslation('home')

  return (
    <Section>
      <SectionHead>
        <div>
          <h2>{t('coursesSection.title')}</h2>
          <p>{t('coursesSection.subtitle')}</p>
        </div>
        {/* TODO: роут создания курса */}
        <ActionLink to="/course" $variant="soft">
          <HomeIcon name="plus" size={16} />
          {t('coursesSection.newCourse')}
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
        <CourseGrid>
          {courses.map((course) => {
            const lessons = lessonCounts[course.id]
            return (
              <CourseCard key={course.id}>
                <CardArt
                  $from={course.colorFrom ?? DEFAULT_COLOR_FROM}
                  $to={course.colorTo ?? DEFAULT_COLOR_TO}
                >
                  <HomeIcon name="book" size={34} />
                </CardArt>
                <CardBody>
                  <Badge variant={STATUS_VARIANT[course.status]}>
                    {t(`coursesSection.cards.status.${course.status}`)}
                  </Badge>
                  <h3>{course.name}</h3>
                  {(course.topic || lessons !== undefined) && (
                    <CardMeta>
                      {course.topic && <span>{course.topic}</span>}
                      {course.topic && lessons !== undefined && <span>·</span>}
                      {lessons !== undefined && (
                        <span>{t('coursesSection.cards.lessons', { count: lessons })}</span>
                      )}
                    </CardMeta>
                  )}
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
          <CreateCard to="/course">
            <CreateIcon>
              <HomeIcon name="plus" size={24} />
            </CreateIcon>
            <strong>{t('coursesSection.createCard.title')}</strong>
            <span>{t('coursesSection.createCard.subtitle')}</span>
          </CreateCard>
        </CourseGrid>
      )}
    </Section>
  )
}
