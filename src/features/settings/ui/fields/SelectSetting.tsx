import { Select } from './SelectSetting.style'
import { SettingRecord } from './SettingRecord'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectSettingProps {
  name: string
  description?: string
  /** Текущее значение (должно совпадать с одной из опций). */
  value: string
  onChange: (value: string) => void
  /** Варианты выбора. */
  options: SelectOption[]
  disabled?: boolean
}

/** Шаблон настройки-списка: выбор одного значения из n вариантов. */
export function SelectSetting({
  name,
  description,
  value,
  onChange,
  options,
  disabled,
}: SelectSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </SettingRecord>
  )
}
