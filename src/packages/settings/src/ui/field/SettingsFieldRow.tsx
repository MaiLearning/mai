import { Text } from '@mai/theme'
import type { ReactNode } from 'react'
import { Field, Label } from './SettingsFieldRow.style'

export interface SettingsFieldRowProps {
  /** Подпись поля. */
  label: string
  /** id контрола для связи label ↔ control. */
  htmlFor?: string
  /** Пояснение под контролом. */
  hint?: string
  /** Ошибка под контролом (перекрывает hint). */
  error?: string
  /** Контрол поля. */
  children: ReactNode
}

/** Обёртка поля настроек: подпись, контрол и пояснение/ошибка. */
export function SettingsFieldRow({ label, htmlFor, hint, error, children }: SettingsFieldRowProps) {
  return (
    <Field>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? (
        <Text size="xs" color="red">
          {error}
        </Text>
      ) : hint ? (
        <Text size="xs" color="gray">
          {hint}
        </Text>
      ) : null}
    </Field>
  )
}
