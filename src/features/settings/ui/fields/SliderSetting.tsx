import { SettingRecord } from './SettingRecord'
import { Range, Value } from './SliderSetting.style'

export interface SliderSettingProps {
  name: string
  description?: string
  /** Текущее числовое значение. */
  value: number
  onChange: (value: number) => void
  /** Нижняя граница диапазона. */
  min: number
  /** Верхняя граница диапазона. */
  max: number
  /** Шаг (по умолчанию 1). */
  step?: number
  /** Формат подписи значения; по умолчанию — само число. */
  format?: (value: number) => string
  disabled?: boolean
}

/** Шаблон настройки-слайдера: числовое значение в диапазоне. */
export function SliderSetting({
  name,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  disabled,
}: SliderSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Value>{format ? format(value) : value}</Value>
      <Range
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={name}
      />
    </SettingRecord>
  )
}
