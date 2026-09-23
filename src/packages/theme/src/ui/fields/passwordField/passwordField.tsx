import type { ComponentPropsWithoutRef } from 'react'
import { useId, useState } from 'react'
import type { FieldProps } from '../../base/field/field'
import { Field } from '../../base/field/field'
import { FieldAdornmentButton, FieldInputRoot } from '../../base/field/fieldInput.style'
import { EyeIcon, EyeOffIcon } from '../../icons/icons/eye'
import { PasswordWrapper } from './passwordField.style'

export interface PasswordFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type' | 'max'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className'> {
  /** Начальное состояние видимости пароля. */
  defaultVisible?: boolean
  /** Скрыть кнопку переключения видимости. */
  showToggle?: boolean
  id?: string
  className?: string
}

/**
 * Поле пароля. На базе `Field` + нативного `<input type="password">` с
 * переключателем видимости справа. Все стандартные атрибуты инпута
 * (value, onChange, placeholder, disabled, autoComplete и т.д.) прокидываются.
 *
 * @example
 * <PasswordField label="Пароль" value={value} onChange={(e) => setValue(e.target.value)} />
 */
export function PasswordField({
  id,
  className,
  label,
  required,
  hint,
  error,
  count,
  max,
  disabled,
  defaultVisible = false,
  showToggle = true,
  value,
  ...inputProps
}: PasswordFieldProps) {
  const internalId = useId()
  const controlId = id ?? internalId
  const [visible, setVisible] = useState(defaultVisible)

  const maxLength = inputProps.maxLength ?? max
  const counterCount =
    count ?? (typeof value === 'string' && maxLength !== undefined ? value.length : undefined)

  return (
    <Field
      className={className}
      htmlFor={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      count={counterCount}
      max={maxLength}
      disabled={disabled}
    >
      <PasswordWrapper>
        <FieldInputRoot
          id={controlId}
          type={visible ? 'text' : 'password'}
          value={value}
          $invalid={error !== undefined}
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-required={required || undefined}
          aria-describedby={hint || error ? `${controlId}-message` : undefined}
          {...inputProps}
        />
        {showToggle ? (
          <FieldAdornmentButton
            type="button"
            aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
            disabled={disabled}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </FieldAdornmentButton>
        ) : null}
      </PasswordWrapper>
    </Field>
  )
}
