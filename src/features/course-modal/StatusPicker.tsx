import { CircleCheck, CircleDashed, CircleDot } from 'lucide-react'
import styled, { css, useTheme } from 'styled-components'
import { useTranslation } from '@/app/i18n'
import type { CourseStatus } from '@/entities/course'

export interface StatusOption {
  value: CourseStatus
  label: string
  hint: string
}

const Group = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;

  @media (min-width: 560px) {
    grid-template-columns: repeat(3, 1fr);
  }
`
const Option = styled.button<{ $active: boolean; $tone: string; $surface: string }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 11px 14px;
  text-align: left;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.body};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  ${({ $active, $tone, $surface }) =>
    $active &&
    css`
      background: ${$surface};
      border-color: ${$tone};
      box-shadow: inset 0 0 0 1px ${$tone};

      &:hover {
        border-color: ${$tone};
      }
    `}
`
const Head = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ $color }) => $color};

  svg {
    color: currentColor;
  }
`
const Hint = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`
const ICONS = {
  draft: CircleDashed,
  in_progress: CircleDot,
  completed: CircleCheck,
} as const

export interface StatusPickerProps {
  value: CourseStatus
  /** Варианты с уже переведёнными подписями и подсказками. */
  options: StatusOption[]
  onChange: (next: CourseStatus) => void
}

/** Выбор статуса курса в виде группы радио-карточек с иконкой и подсказкой. */
export function StatusPicker({ value, options, onChange }: StatusPickerProps) {
  const { t } = useTranslation('courseModal')
  const theme = useTheme()
  const tones: Record<CourseStatus, { tone: string; surface: string }> = {
    draft: { tone: theme.colors.textMuted, surface: theme.colors.primarySurface },
    in_progress: { tone: theme.colors.warning, surface: theme.colors.warningSurface },
    completed: { tone: theme.colors.success, surface: theme.colors.successSurface },
  }

  return (
    <Group role="radiogroup" aria-label={t('fields.statusGroupLabel')}>
      {options.map((option) => {
        const Icon = ICONS[option.value]
        const active = value === option.value
        const { tone, surface } = tones[option.value]

        return (
          <Option
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            $active={active}
            $tone={tone}
            $surface={surface}
            onClick={() => onChange(option.value)}
          >
            <Head $color={active ? tone : theme.colors.text}>
              <Icon size={15} aria-hidden="true" />
              {option.label}
            </Head>
            <Hint>{option.hint}</Hint>
          </Option>
        )
      })}
    </Group>
  )
}
