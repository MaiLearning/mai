import { Input } from '@/app/theme/components'
import { SettingRecord } from './SettingRecord'

export interface InputSettingProps {
  name: string
  description?: string
  /** Текущее значение (строка или число — контрол всегда отдаёт строку). */
  value: string | number
  /** Изменение значения; тип number на стороне секции. */
  onChange: (value: string) => void
  /** text или number. */
  type?: 'text' | 'number'
  placeholder?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

/** Шаблон настройки-поля ввода: например числовое значение лимита. */
export function InputSetting({
  name,
  description,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
  step,
  disabled,
}: InputSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        style={{ width: 220 }}
      />
    </SettingRecord>
  )
}
