import { useTranslation } from '@mai/i18n'
import { Button, Card } from '@mai/theme'
import { Check, FilePenLine, Play } from 'lucide-react'
import type { Course } from '../../../core'
import { CourseCover } from '../courseCover/CourseCover'
import { HomeIcon } from '../HomeIcon'
import { StatusBadge } from '../shared.style'
import {
  GridCardBody,
  GridCardButton,
  GridCardDescription,
  GridCardDuration,
  GridCardMetaRow,
} from './CourseGridCard.style'

const STATUS_ICONS = {
  draft: FilePenLine,
  in_progress: Play,
  completed: Check,
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
  const StatusIcon = STATUS_ICONS[course.status]

  return (
    <Card as="article">
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
            <HomeIcon name="clock" size={13} />
            {durationLabel}
          </GridCardDuration>
        )}
        <h3>{course.name}</h3>
        {course.description && <GridCardDescription>{course.description}</GridCardDescription>}
        <GridCardMetaRow>
          {lessons !== undefined && (
            <span>{t('coursesSection.cards.lessons', { count: lessons })}</span>
          )}
          <StatusBadge $status={course.status}>
            <StatusIcon size={13} aria-hidden="true" />
            {t(`coursesSection.cards.status.${course.status}`)}
          </StatusBadge>
        </GridCardMetaRow>
        <GridCardButton>
          <Button variant="secondary" onClick={() => onOpen(course)}>
            {t('coursesSection.cards.openCourse')}
            <HomeIcon name="arrow" size={15} />
          </Button>
        </GridCardButton>
      </GridCardBody>
    </Card>
  )
}
