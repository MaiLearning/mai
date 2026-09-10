import { Value } from './InfoSetting.style'
import { SettingRecord } from './SettingRecord'

export interface InfoSettingProps {
  name: string
  description?: string
  /** Отображаемое значение (read-only). */
  value: string
}

/** Шаблон настройки-сведений: значение только для чтения (версия, путь). */
export function InfoSetting({ name, description, value }: InfoSettingProps) {
  return (
    <SettingRecord name={name} description={description}>
      <Value>{value}</Value>
    </SettingRecord>
  )
}
