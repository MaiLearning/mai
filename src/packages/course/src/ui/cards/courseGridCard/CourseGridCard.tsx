import { useTranslation } from '@mai/i18n'
import { Badge, Button, Heading, Icon } from '@mai/theme'
import type { Course } from '../../../core'
import { CourseCover } from '../courseCover/CourseCover'
import { CourseCardRoot } from '../shared.style'
import {
  GridCardBody,
  GridCardButton,
  GridCardDescription,
  GridCardDuration,
  GridCardMetaRow,
} from './CourseGridCard.style'

const STATUS_ICONS = {
  draft: 'filePenLine',
  in_progress: 'play',
  completed: 'check',
} as const

const STATUS_TONES = {
  draft: 'warning',
  in_progress: 'accent',
  completed: 'success',
} as const

interface CourseGridCardProps {
  course: Course
  lessons?: number
  /** Длительности в модели нет — заглушка, строка прячется пока данных нет. */
  durationLabel?: string
  onEdit: (course: Course) => void
  onOpen: (course: Course) => void
}

/** Карточка курса для сетки: обложка + длительность + уроки/статус + кнопка на всю ширину. */
export function CourseGridCard({
  course,
  lessons,
  durationLabel,
  onEdit,
  onOpen,
}: CourseGridCardProps) {
  const { t } = useTranslation('course')

  return (
    <CourseCardRoot as="article">
      <CourseCover
        colorFrom={course.colorFrom}
        colorTo={course.colorTo}
        tags={course.tags}
        editLabel={t('coursesSection.cards.settings')}
        onEdit={() => onEdit(course)}
      />
      <GridCardBody>
        {durationLabel && (
          <GridCardDuration>
            <Icon name="clock3" size={13} aria-hidden="true" />
            {durationLabel}
          </GridCardDuration>
        )}
        <Heading as="h3" size="md">
          {course.name}
        </Heading>
        {course.description && <GridCardDescription>{course.description}</GridCardDescription>}
        <GridCardMetaRow>
          {lessons !== undefined && (
            <span>{t('coursesSection.cards.lessons', { count: lessons })}</span>
          )}
          <Badge tone={STATUS_TONES[course.status]}>
            <Icon name={STATUS_ICONS[course.status]} size={13} aria-hidden="true" />
            {t(`coursesSection.cards.status.${course.status}`)}
          </Badge>
        </GridCardMetaRow>
        <GridCardButton>
          <Button variant="secondary" onClick={() => onOpen(course)}>
            {t('coursesSection.cards.openCourse')}
            <Icon name="arrowRight" size={15} aria-hidden="true" />
          </Button>
        </GridCardButton>
      </GridCardBody>
    </CourseCardRoot>
  )
}
