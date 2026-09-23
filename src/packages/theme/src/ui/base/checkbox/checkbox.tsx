import { CheckIcon } from '../../icons/icons/check'
import { CheckboxRoot, Indicator } from './checkbox.style'

export interface CheckboxProps {
  /** Текущее состояние флажка. */
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
}

/**
 * Флажок выбора. Управляемый компонент: `role="checkbox"` с `aria-checked`
 * и кликабельным индикатором.
 */
export function Checkbox({
  checked,
  onChange,
  disabled,
  id,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  return (
    <CheckboxRoot
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      $checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <Indicator $checked={checked} aria-hidden>
        {checked && <CheckIcon />}
      </Indicator>
    </CheckboxRoot>
  )
}
