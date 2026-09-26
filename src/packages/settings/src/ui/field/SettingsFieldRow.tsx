import { Field } from '@mai/theme'
import type { ReactNode } from 'react'

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

/**
 * Обёртка поля настроек: подпись, контрол и пояснение/ошибка. Адаптер над
 * паттерном `Field` темы — связывает `label` с контролом по `htmlFor` и
 * показывает сообщение (ошибка перекрывает подсказку).
 */
export function SettingsFieldRow({ label, htmlFor, hint, error, children }: SettingsFieldRowProps) {
  return (
    <Field label={label} htmlFor={htmlFor} hint={hint} error={error}>
      {children}
    </Field>
  )
}
