import { Checkbox } from '../checkbox/checkbox'
import { Text } from '../text/text'
import { CheckboxGroupRoot, CheckboxRow } from './checkboxGroup.style'

export interface CheckboxGroupItem {
  value: string
  label: string
}

export interface CheckboxGroupProps {
  /** Выбранные значения. */
  value: readonly string[]
  onChange: (value: string[]) => void
  items: readonly CheckboxGroupItem[]
  disabled?: boolean
  'aria-label'?: string
  className?: string
}

/**
 * Группа флажков выбора нескольких значений. Отображает список
 * `<Checkbox>` с подписями; переключение элемента опирается на
 * массив `value` (add/remove).
 */
export function CheckboxGroup({
  value,
  onChange,
  items,
  disabled,
  'aria-label': ariaLabel,
  className,
}: CheckboxGroupProps) {
  const toggle = (itemValue: string) => {
    const next = value.includes(itemValue)
      ? value.filter((v) => v !== itemValue)
      : [...value, itemValue]
    onChange(next)
  }

  return (
    <CheckboxGroupRoot className={className} role="group" aria-label={ariaLabel}>
      {items.map((item) => (
        <CheckboxRow key={item.value}>
          <Checkbox
            checked={value.includes(item.value)}
            onChange={() => toggle(item.value)}
            disabled={disabled}
            aria-label={item.label}
          />
          <Text size="md" color={disabled ? 'muted' : 'primary'}>
            {item.label}
          </Text>
        </CheckboxRow>
      ))}
    </CheckboxGroupRoot>
  )
}
