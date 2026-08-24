import { X } from 'lucide-react'
import styled from 'styled-components'
import { useTranslation } from '@/app/i18n'
import type { CourseStatus } from '@/entities/course'
import type { CourseFormValues } from './useCourseForm'
import { mix, readableOn, rgba } from './utils/color'

const Header = styled.header<{ $from: string; $to: string; $ink: string }>`
  position: relative;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.lg};
  color: ${({ $ink }) => $ink};
  background: linear-gradient(135deg, ${({ $from }) => $from} 0%, ${({ $to }) => $to} 100%);
  transition: background ${({ theme }) => theme.transitions.normal};
  isolation: isolate;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(120% 90% at 88% -20%, rgba(255, 255, 255, 0.32), transparent 60%);
    pointer-events: none;
  }

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md} 28px ${({ theme }) => theme.spacing.lg};
  }
`
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: 28px;
`
const Eyebrow = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.72;
`
const Title = styled.h2<{ $placeholder: boolean }>`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
  opacity: ${({ $placeholder }) => ($placeholder ? 0.5 : 1)};
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.md};
`
const Chip = styled.span<{ $ink: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ $ink }) => rgba($ink === '#ffffff' ? '#ffffff' : '#161428', 0.18)};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  backdrop-filter: blur(4px);
`
const Dot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 2px currentColor;
  opacity: 0.9;
`
const CloseButton = styled.button<{ $onGradient: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  ${({ theme, $onGradient }) =>
    $onGradient
      ? `
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px);

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          color: #fff;
        }
      `
      : `
        color: ${theme.colors.textMuted};
        background: transparent;

        &:hover {
          background: ${theme.colors.primarySurface};
          color: ${theme.colors.text};
        }
      `}
`
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
  const { t } = useTranslation('courseModal')
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
