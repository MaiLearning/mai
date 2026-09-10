import { SettingRecord } from './SettingRecord'
import { Knob, Switch } from './ToggleSetting.style'

export interface ToggleSettingProps {
  name: string
  description?: string
  /** Включено ли. */
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

/** Шаблон настройки-переключателя: включить/выключить что-либо. */
export function ToggleSetting({
  name,
  description,
  checked,
  onChange,
  disabled,
}: ToggleSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Switch
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={name}
        $checked={checked}
        $disabled={disabled}
        onClick={() => onChange(!checked)}
        disabled={disabled}
      >
        <Knob $checked={checked} />
      </Switch>
    </SettingRecord>
  )
}
