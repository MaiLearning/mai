import { Switch } from '@mai/theme'

export interface ToggleControlProps {
  /** Текущее значение. */
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
}

/** Переключатель on/off (поле типа `toggle`). */
export function ToggleControl({
  value,
  onChange,
  disabled,
  id,
  'aria-label': ariaLabel,
}: ToggleControlProps) {
  return (
    <Switch checked={value} onChange={onChange} disabled={disabled} id={id} aria-label={ariaLabel} />
  )
}
