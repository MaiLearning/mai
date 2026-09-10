import { Button } from '@/app/theme/components'
import { SettingRecord } from './SettingRecord'

export interface ActionSettingProps {
  name: string
  description?: string
  /** Текст на кнопке. */
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'dangerSoft'
  /** Процесс выполнения — кнопка блокируется. */
  busy?: boolean
}

/** Шаблон настройки-действия: кнопка (например, «Очистить кэш»). */
export function ActionSetting({
  name,
  description,
  label,
  onClick,
  variant = 'secondary',
  busy,
}: ActionSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Button variant={variant} onClick={onClick} disabled={busy}>
        {busy ? '…' : label}
      </Button>
    </SettingRecord>
  )
}
