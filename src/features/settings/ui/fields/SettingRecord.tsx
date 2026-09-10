import type { ReactNode } from 'react'
import { Description, Info, Name, Root } from './SettingRecord.style'

export interface SettingRecordProps {
  /** Название настройки. */
  name: string
  /** Описание настройки (что делает, к чему применяется). */
  description?: string
  /** Контрол настройки (input/switch/select/...). */
  children: ReactNode
}

/**
 * Каркас одной записи настройки: название + описание слева, контрол
 * справа. Служит рамкой для всех шаблонов полей (fields/) — единый
 * вид записей во всех секциях, включая секции плагинов.
 */
export function SettingRecord({ name, description, children }: SettingRecordProps) {
  return (
    <Root>
      <Info>
        <Name>{name}</Name>
        {description && <Description>{description}</Description>}
      </Info>
      {children}
    </Root>
  )
}
