import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { Counter, ErrorText, FieldRoot, Hint, LabelRow, LabelText } from './Field.style'

export interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  count?: number
  max?: number
  children: ReactNode
}

/** Обёртка поля формы: label + счётчик символов + подсказка/ошибка. */
export function Field({ label, htmlFor, required, hint, error, count, max, children }: FieldProps) {
  return (
    <FieldRoot>
      <LabelRow>
        <LabelText htmlFor={htmlFor}>
          {label}
          {required ? <span aria-hidden="true">*</span> : null}
        </LabelText>
        {typeof count === 'number' && typeof max === 'number' ? (
          <Counter $over={count > max}>
            {count}/{max}
          </Counter>
        ) : null}
      </LabelRow>
      {children}
      {error ? (
        <ErrorText role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </ErrorText>
      ) : hint ? (
        <Hint>{hint}</Hint>
      ) : null}
    </FieldRoot>
  )
}
