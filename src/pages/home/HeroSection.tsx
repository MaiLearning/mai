import { useTranslation } from '@/app/i18n'
import { Badge, Button, ProgressFill, ProgressTrack } from '@/app/theme/components'
import type { Course } from '@/entities/course'
import {
  ContinueCard,
  CourseName,
  Hero,
  HeroActions,
  HeroText,
  HeroTitle,
  Meta,
  ProgressLabel,
  Thumb,
  TopRow,
} from './HeroSection.styles'
import { HomeIcon } from './HomeIcon'
import { ActionLink } from './shared.styles'

interface HeroSectionProps {
  /** Курс для continue-карточки (резолвится в useCourses). */
  continueCourse: Course | null
  lessonCounts: Record<string, number>
  /** Открыть модальное окно создания курса. */
  onCreateCourse: () => void
}

export function HeroSection({ continueCourse, lessonCounts, onCreateCourse }: HeroSectionProps) {
  const { t } = useTranslation('home')
  const lessons = continueCourse ? lessonCounts[continueCourse.id] : undefined

  return (
    <Hero>
      <div>
        <Badge variant="accent">
          <HomeIcon name="spark" size={14} />
          {t('hero.badge')}
        </Badge>
        <HeroTitle>{t('hero.title')}</HeroTitle>
        <HeroText>{t('hero.text')}</HeroText>
        <HeroActions>
          <Button size="lg" onClick={onCreateCourse}>
            <HomeIcon name="plus" size={18} />
            {t('hero.createCourse')}
          </Button>
          <ActionLink
            to={continueCourse ? `/course/${continueCourse.id}` : '/home'}
            $variant="ghost"
            $size="lg"
          >
            {t('hero.continueLearning')} <HomeIcon name="arrow" size={18} />
          </ActionLink>
        </HeroActions>
      </div>

      {continueCourse && (
        <ContinueCard aria-label={t('hero.continueCard.ariaLabel')}>
          <TopRow>
            <Badge variant="primary">
              <HomeIcon name="flame" size={14} />
              {t('hero.badges.continue')}
            </Badge>
            <Badge variant="neutral">{t('hero.badges.yourCourse')}</Badge>
          </TopRow>
          <Thumb
            $from={continueCourse.colorFrom ?? undefined}
            $to={continueCourse.colorTo ?? undefined}
          >
            <HomeIcon name="book" size={44} />
          </Thumb>
          <div>
            <CourseName>{continueCourse.name}</CourseName>
            <Meta>
              {continueCourse.tags.length > 0 && (
                <>
                  <HomeIcon name="book" size={14} />
                  <span>{continueCourse.tags.slice(0, 3).join(', ')}</span>
                </>
              )}
              {lessons !== undefined && (
                <>
                  <span>{t('hero.progress.metaSeparator')}</span>
                  <span>{t('coursesSection.cards.lessons', { count: lessons })}</span>
                </>
              )}
            </Meta>
          </div>
          <div>
            <ProgressLabel>
              {/* Прогресс-трекинга пока нет — 0 из N уроков (follow-up) */}
              <span>{t('hero.progressLabel.percent', { percent: 0 })}</span>
              <span>{t('hero.progressLabel.fraction', { done: 0, total: lessons ?? 0 })}</span>
            </ProgressLabel>
            <ProgressTrack
              role="progressbar"
              aria-valuenow={0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <ProgressFill $percent={0} />
            </ProgressTrack>
          </div>
          <ActionLink to={`/course/${continueCourse.id}`}>
            {t('hero.resumeCourse')} <HomeIcon name="arrow" size={16} />
          </ActionLink>
        </ContinueCard>
      )}
    </Hero>
  )
}
