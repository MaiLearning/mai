import { Text } from '@mai/theme'
import type { ReactNode } from 'react'
import styles from './SettingsFieldRow.module.css'

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
    <div className={styles.field}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
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
    </div>
  )
}
