import { useTranslation } from '@mai/i18n'
import { Button } from '@mai/theme'
import { ChevronRight, Play } from 'lucide-react'
import type { Course } from '../../../core'
import { CourseCover } from '../courseCover/CourseCover'
import { CourseCardRoot } from '../shared.style'
import {
  HeroCta,
  HeroFoot,
  HeroInfo,
  HeroInProgress,
  HeroLastOpened,
  HeroStatusRow,
  HeroTitle,
} from './FeaturedCourseCard.style'

interface FeaturedCourseCardProps {
  course: Course
  lessonsTotal?: number
  /** Название текущего урока. Нет данных — покажем название курса. */
  currentLessonTitle?: string
  /** Номер текущего урока (1-based) для «Урок n из n». */
  currentLessonIndex?: number
  /** Подпись времени открытия, например «Открывали сегодня в 10:42». */
  lastOpenedLabel?: string
  onOpen: (course: Course) => void
  onEdit: (course: Course) => void
}

/** Главная карточка: continue-курс с крупной обложкой и кнопкой «Открыть урок». */
export function FeaturedCourseCard({
  course,
  lessonsTotal,
  currentLessonTitle,
  currentLessonIndex,
  lastOpenedLabel,
  onOpen,
  onEdit,
}: FeaturedCourseCardProps) {
  const { t } = useTranslation('course')

  return (
    <CourseCardRoot as="section" interactive={false} aria-label={course.name}>
      <CourseCover
        colorFrom={course.colorFrom}
        colorTo={course.colorTo}
        tags={course.tags}
        editLabel={t('coursesSection.cards.settings')}
        onEdit={() => onEdit(course)}
        size="lg"
        overlay={{ eyebrow: t('coursesSection.featured.continueEyebrow'), title: course.name }}
      />
      <HeroFoot>
        <HeroInfo>
          <HeroStatusRow>
            <HeroInProgress>
              <Play size={12} aria-hidden="true" fill="currentColor" />
              {t('coursesSection.featured.inProgress')}
            </HeroInProgress>
            {currentLessonIndex !== undefined && lessonsTotal !== undefined && (
              <>
                <span aria-hidden="true">•</span>
                <span>
                  {t('coursesSection.featured.lessonOf', {
                    current: currentLessonIndex,
                    total: lessonsTotal,
                  })}
                </span>
              </>
            )}
          </HeroStatusRow>
          <HeroTitle>{currentLessonTitle ?? course.name}</HeroTitle>
          {lastOpenedLabel && <HeroLastOpened>{lastOpenedLabel}</HeroLastOpened>}
        </HeroInfo>
        <HeroCta>
          <Button
            onClick={() => onOpen(course)}
            endIcon={<ChevronRight size={16} aria-hidden="true" />}
          >
            {t('coursesSection.featured.openLesson')}
          </Button>
        </HeroCta>
      </HeroFoot>
    </CourseCardRoot>
  )
}
