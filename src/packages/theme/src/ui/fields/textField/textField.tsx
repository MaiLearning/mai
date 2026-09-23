import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import type { FieldProps } from '../../base/field/field'
import { Field } from '../../base/field/field'
import { FieldInputRoot } from '../../base/field/fieldInput.style'

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'max'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className'> {
  /** id инпута — связывает label ↔ input и сообщение. */
  id?: string
  className?: string
}

/**
 * Поле ввода одной строки. Обёртка `Field` + стилизованный нативный
 * `<input>`: все стандартные атрибуты (type, value, onChange, placeholder,
 * disabled, maxLength и т.д.) прокидываются напрямую. При заданном `max`
 * (или нативном `maxLength`) счётчик символов подсчитывается из `value`
 * автоматически и может быть переопределён через `count`.
 *
 * @example
 * <TextField label="Название" value={value} onChange={(e) => setValue(e.target.value)} max={50} />
 */
export function TextField({
  id,
  className,
  label,
  required,
  hint,
  error,
  count,
  max,
  disabled,
  value,
  ...inputProps
}: TextFieldProps) {
  const internalId = useId()
  const controlId = id ?? internalId

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
      <FieldInputRoot
        id={controlId}
        value={value}
        $invalid={error !== undefined}
        disabled={disabled}
        aria-invalid={error !== undefined}
        aria-required={required || undefined}
        aria-describedby={hint || error ? `${controlId}-message` : undefined}
        {...inputProps}
      />
    </Field>
  )
}
