import { SegmentedItem, SegmentedRoot } from './segmentedControl.style'

export interface SegmentedControlItem {
  value: string
  label: string
}

export interface SegmentedControlProps {
  /** Выбранное значение. */
  value: string
  onChange: (value: string) => void
  items: readonly SegmentedControlItem[]
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
}

/**
 * Сегментированный переключатель (переключающие кнопки вместо вкладок).
 * Один выбор из 2–4 вариантов: активный сегмент выделяется подложкой
 * выбранного состояния и акцентной границей.
 */
export function SegmentedControl({
  value,
  onChange,
  items,
  disabled,
  id,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps) {
  return (
    <SegmentedRoot
      id={id}
      className={className}
      role="radiogroup"
      aria-label={ariaLabel}
      $disabled={disabled}
    >
      {items.map((item) => (
        <SegmentedItem
          key={item.value}
          type="button"
          role="radio"
          aria-checked={item.value === value}
          $selected={item.value === value}
          disabled={disabled}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </SegmentedItem>
      ))}
    </SegmentedRoot>
  )
}
