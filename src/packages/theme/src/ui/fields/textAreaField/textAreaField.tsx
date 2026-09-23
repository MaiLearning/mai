import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import type { FieldProps } from '../../base/field/field'
import { Field } from '../../base/field/field'
import { TextAreaRoot } from './textAreaField.style'

export interface TextAreaFieldProps
  extends Omit<ComponentPropsWithoutRef<'textarea'>, 'className'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className'> {
  /** id поляввода — связывает label ↔ textarea и сообщение. */
  id?: string
  className?: string
}

/**
 * Многострочное поле ввода. Обёртка `Field` + стилизованный нативный
 * `<textarea>`: все стандартные атрибуты (value, onChange, placeholder,
 * rows, maxLength, disabled и т.д.) прокидываются напрямую. При заданном
 * `max` (или нативном `maxLength`) счётчик символов подсчитывается из
 * `value` автоматически и может быть переопределён через `count`.
 *
 * @example
 * <TextAreaField label="Описание" value={value} onChange={(e) => setValue(e.target.value)} max={200} />
 */
export function TextAreaField({
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
  maxLength,
  ...inputProps
}: TextAreaFieldProps) {
  const internalId = useId()
  const controlId = id ?? internalId

  const limit = maxLength ?? max
  const counterCount =
    count ?? (typeof value === 'string' && limit !== undefined ? value.length : undefined)

  return (
    <Field
      className={className}
      htmlFor={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      count={counterCount}
      max={limit}
      disabled={disabled}
    >
      <TextAreaRoot
        id={controlId}
        value={value}
        maxLength={limit}
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
