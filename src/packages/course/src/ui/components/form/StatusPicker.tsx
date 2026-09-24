import { useTranslation } from '@mai/i18n'
import { useAppTheme } from '@mai/theme'
import { CircleCheck, CircleDashed, CircleDot } from 'lucide-react'
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
  const { theme } = useAppTheme()
  const tones: Record<CourseStatus, { tone: string; surface: string }> = {
    draft: {
      tone: theme.utils.getText('neutral', 'muted'),
      surface: theme.utils.getBackground('accent', 'surface'),
    },
    in_progress: {
      tone: theme.utils.getText('warning', 'primary'),
      surface: theme.utils.getBackground('warning', 'surface'),
    },
    completed: {
      tone: theme.utils.getText('success', 'primary'),
      surface: theme.utils.getBackground('success', 'surface'),
    },
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
            <Head $color={active ? tone : theme.utils.getText('neutral', 'primary')}>
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
