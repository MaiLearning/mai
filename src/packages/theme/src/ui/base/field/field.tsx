import type { ReactNode } from 'react'
import { useId } from 'react'
import { Counter, ErrorText, FieldRoot, Hint, LabelRow, LabelText } from './field.style'

export interface FieldProps {
  /** Подпись поля. */
  label?: ReactNode
  /** id контрола для связи label ↔ control. */
  htmlFor?: string
  /** Обязательное поле — звёздочка у подписи. */
  required?: boolean
  /** Пояснение под контролом. */
  hint?: string
  /** Ошибка — перекрывает hint и подсвечивается danger. */
  error?: string
  /** Текущее количество символов (для счётчика). */
  count?: number
  /** Лимит символов для счётчика. */
  max?: number
  /** Приглушает подпись и сообщения (контрол гасится сам). */
  disabled?: boolean
  /** Контрол поля. */
  children: ReactNode
  className?: string
}

/**
 * Field — примитив поля: подпись с обязательностью и счётчиком символов,
 * контрол (через children) и сообщение под ним (подсказка или ошибка).
 * Универсальный базис для конкретных полей (`TextField`, `TextAreaField`
 * и остальных из `ui/fields/`) и для произвольных контролов.
 */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  count,
  max,
  disabled,
  children,
  className,
}: FieldProps) {
  const fallbackId = useId()
  const messageId = htmlFor ? `${htmlFor}-message` : fallbackId
  const showHeader = label != null || (typeof count === 'number' && typeof max === 'number')

  return (
    <FieldRoot className={className}>
      {showHeader && (
        <LabelRow>
          {label != null && (
            <LabelText $disabled={disabled} htmlFor={htmlFor}>
              {label}
              {required ? <span aria-hidden="true">*</span> : null}
            </LabelText>
          )}
          {typeof count === 'number' && typeof max === 'number' ? (
            <Counter $over={count > max} $disabled={disabled}>
              {count}/{max}
            </Counter>
          ) : null}
        </LabelRow>
      )}
      {children}
      {error ? (
        <ErrorText id={messageId} role="alert">
          {error}
        </ErrorText>
      ) : hint ? (
        <Hint id={messageId} $disabled={disabled}>
          {hint}
        </Hint>
      ) : null}
    </FieldRoot>
  )
}
