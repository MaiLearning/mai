import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import styled from 'styled-components'

const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`
const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`
const LabelText = styled.label`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.text};

  span {
    color: ${({ theme }) => theme.colors.primary};
    margin-left: 3px;
  }
`
const Counter = styled.span<{ $over?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $over }) => ($over ? theme.colors.danger : theme.colors.textMuted)};
`
const Hint = styled.p`
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`
const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 12.5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
`

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
