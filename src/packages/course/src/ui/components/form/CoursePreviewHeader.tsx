import { useTranslation } from '@mai/i18n'
import { X } from 'lucide-react'
import type { CourseStatus } from '../../../core'
import { mix, readableOn } from '../../utils/color'
import {
  Chip,
  CloseButton,
  Dot,
  Eyebrow,
  Header,
  MetaRow,
  Title,
  TopRow,
} from './CoursePreviewHeader.style'
import type { CourseFormValues } from './useCourseForm'

/** Точки статуса в чипе превью — фиксированные цвета поверх градиента. */
const STATUS_DOT: Record<CourseStatus, string> = {
  draft: '#948fa8',
  in_progress: '#fcd34d',
  completed: '#34d399',
}

export interface CoursePreviewHeaderProps {
  values: CourseFormValues
  /** Надпись над заголовком (например «Новый курс»). */
  eyebrow: string
  onClose: () => void
  titleId: string
}

/**
 * Градиентный хедер модалки с живым превью карточки курса:
 * название, статус и теги обновляются вместе с формой.
 */
export function CoursePreviewHeader({
  values,
  eyebrow,
  onClose,
  titleId,
}: CoursePreviewHeaderProps) {
  const { t } = useTranslation('course')
  const ink = readableOn(mix(values.gradient.from, values.gradient.to, 0.5))
  const onGradient = ink === '#ffffff'
  const hasName = values.name.trim().length > 0

  return (
    <Header $from={values.gradient.from} $to={values.gradient.to} $ink={ink}>
      <TopRow>
        <Eyebrow>{eyebrow}</Eyebrow>
        <CloseButton
          type="button"
          $onGradient={onGradient}
          onClick={onClose}
          aria-label={t('close')}
        >
          <X size={18} aria-hidden="true" />
        </CloseButton>
      </TopRow>

      <Title id={titleId} $placeholder={!hasName}>
        {hasName ? values.name : t('previewTitlePlaceholder')}
      </Title>

      <MetaRow>
        <Chip $ink={ink}>
          <Dot $color={STATUS_DOT[values.status]} aria-hidden="true" />
          {t(`statuses.${values.status}.label`)}
        </Chip>
        {values.tags.slice(0, 3).map((tag) => (
          <Chip key={tag} $ink={ink}>
            {tag}
          </Chip>
        ))}
        {values.tags.length > 3 ? <Chip $ink={ink}>+{values.tags.length - 3}</Chip> : null}
      </MetaRow>
    </Header>
  )
}
