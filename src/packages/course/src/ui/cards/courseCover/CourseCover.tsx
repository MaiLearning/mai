import { Pencil } from 'lucide-react'
import { mix, readableOn } from '../../utils/color'
import {
  CoverEditButton,
  CoverEyebrow,
  CoverOverlay,
  CoverRoot,
  CoverShade,
  CoverTag,
  CoverTags,
  CoverTitle,
} from './CourseCover.style'

export type CourseCoverSize = 'sm' | 'lg'

const DEFAULT_COLOR_FROM = '#6a54ff'
const DEFAULT_COLOR_TO = '#9d7bff'

export interface CoverOverlayContent {
  eyebrow: string
  title: string
}

interface CourseCoverProps {
  colorFrom: string | null
  colorTo: string | null
  tags: string[]
  editLabel: string
  onEdit: () => void
  size?: CourseCoverSize
  /** Оверлей hero (lg): подпись + название поверх градиента. */
  overlay?: CoverOverlayContent
}

/**
 * Общая обложка карточек курса: градиент, теги-чипы, кнопка редактирования.
 * Размер sm — сетка, lg — hero с оверлеем названия.
 */
export function CourseCover({
  colorFrom,
  colorTo,
  tags,
  editLabel,
  onEdit,
  size = 'sm',
  overlay,
}: CourseCoverProps) {
  const from = colorFrom ?? DEFAULT_COLOR_FROM
  const to = colorTo ?? DEFAULT_COLOR_TO
  const ink = readableOn(mix(from, to, 0.5))

  return (
    <CoverRoot $from={from} $to={to} $ink={ink} $size={size}>
      {overlay && <CoverShade aria-hidden="true" />}
      <CoverTags>
        {tags.map((tag) => (
          <CoverTag key={tag} $ink={ink}>
            {tag}
          </CoverTag>
        ))}
      </CoverTags>
      <CoverEditButton type="button" aria-label={editLabel} onClick={onEdit}>
        <Pencil size={15} aria-hidden="true" />
      </CoverEditButton>
      {overlay && (
        <CoverOverlay>
          <CoverEyebrow>{overlay.eyebrow}</CoverEyebrow>
          <CoverTitle>{overlay.title}</CoverTitle>
        </CoverOverlay>
      )}
    </CoverRoot>
  )
}
