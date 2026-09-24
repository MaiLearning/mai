import { useTranslation } from '@mai/i18n'
import { CheckboxGroup, Text } from '@mai/theme'

export interface MultiSelectionControlProps {
  /** Выбранные значения. */
  value: string[]
  onChange: (value: string[]) => void
  /** Канонические значения из `params.options`. */
  options: readonly string[]
  /** Отображаемые подписи по значению; нет — показывается само значение. */
  labels?: Record<string, string>
  disabled?: boolean
}

/** Выбор нескольких значений из списка (поле типа `multi_selection`). */
export function MultiSelectionControl({
  value,
  onChange,
  options,
  labels,
  disabled,
}: MultiSelectionControlProps) {
  const { t } = useTranslation('settings')

  if (options.length === 0) {
    return (
      <Text color="gray" size="sm">
        {t('controls.noOptions')}
      </Text>
    )
  }

  return (
    <CheckboxGroup
      value={value}
      onChange={onChange}
      items={options.map((option) => ({ value: option, label: labels?.[option] ?? option }))}
      disabled={disabled}
    />
  )
}
