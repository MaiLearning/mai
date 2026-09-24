import { useTranslation } from '@mai/i18n'
import { SegmentedControl, Select, Text } from '@mai/theme'

/** До стольки вариантов — сегментированный переключатель, дальше — выпадающий список. */
const SEGMENTED_MAX_OPTIONS = 4

export interface SingleSelectionControlProps {
  /** Выбранное значение. */
  value: string
  onChange: (value: string) => void
  /** Канонические значения из `params.options`. */
  options: readonly string[]
  /** Отображаемые подписи по значению; нет — показывается само значение. */
  labels?: Record<string, string>
  disabled?: boolean
  id?: string
}

/** Выбор одного значения из списка (поле типа `single_selection`). */
export function SingleSelectionControl({
  value,
  onChange,
  options,
  labels,
  disabled,
  id,
}: SingleSelectionControlProps) {
  const { t } = useTranslation('settings')
  const labelOf = (option: string) => labels?.[option] ?? option

  if (options.length === 0) {
    return (
      <Text color="gray" size="sm">
        {t('controls.noOptions')}
      </Text>
    )
  }

  if (options.length <= SEGMENTED_MAX_OPTIONS) {
    return (
      <SegmentedControl
        value={value}
        onChange={onChange}
        items={options.map((option) => ({ value: option, label: labelOf(option) }))}
        disabled={disabled}
        id={id}
      />
    )
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      items={options.map((option) => ({ value: option, label: labelOf(option) }))}
      placeholder={t('controls.selectPlaceholder')}
      disabled={disabled}
      id={id}
    />
  )
}
