import { TextField } from '@mai/theme'

export interface TextControlProps {
  /** Текущее значение. */
  value: string
  onChange: (value: string) => void
  /** Тип ввода: текст, ссылка или дата. */
  type?: 'text' | 'url' | 'date'
  placeholder?: string
  disabled?: boolean
  id?: string
  maxLength?: number
}

/** Ввод строки (поля типов `text_input`, `url_input`, `date_input`). */
export function TextControl({
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  id,
  maxLength,
}: TextControlProps) {
  return (
    <TextField
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      id={id}
      maxLength={maxLength}
    />
  )
}
