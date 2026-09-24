import { SwitchRoot, Thumb } from './switch.style'

export interface SwitchProps {
  /** Текущее состояние переключателя. */
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  id?: string
  'aria-label'?: string
}

/**
 * Переключатель on/off. Управляемый компонент с псевдосемантикой
 * нативной кнопки: `role="switch"` и `aria-checked` обеспечивают
 * доступность без скрытых инпутов.
 */
export function Switch({ checked, onChange, disabled, id, 'aria-label': ariaLabel }: SwitchProps) {
  return (
    <SwitchRoot
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      id={id}
      $checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <Thumb $checked={checked} />
    </SwitchRoot>
  )
}
