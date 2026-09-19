import { useTranslation } from '@mai/i18n'
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-react'
import { useTheme } from 'styled-components'
import type { CourseStatus } from '../../../core'
import { Group, Head, Hint, Option } from './StatusPicker.style'

export interface StatusOption {
  value: CourseStatus
  label: string
  hint: string
}

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
  const { t } = useTranslation('course')
  const theme = useTheme()
  const tones: Record<CourseStatus, { tone: string; surface: string }> = {
    draft: { tone: theme.text.muted, surface: theme.background.accentSubtle },
    in_progress: {
      tone: theme.status.warning.foreground,
      surface: theme.status.warning.background,
    },
    completed: { tone: theme.status.success.foreground, surface: theme.status.success.background },
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
            <Head $color={active ? tone : theme.text.primary}>
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
