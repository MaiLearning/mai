import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import type { FieldProps } from '../../../../src/components/pattern/field/field'
import { Field } from '../../../../src/components/pattern/field/field'
import { useFieldControl } from '../../../../src/components/pattern/field/fieldControl'
import { Input } from '../../../../src/components/primitive/input/input'

export interface TextFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'max' | 'size'>,
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
 * автоматически и может быть переопределён через `count`. Лимитом счётчика
 * служит `max`, если он задан, иначе — `maxLength`: так `maxLength` можно
 * оставить с запасом относительно валидации.
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

  const control = useFieldControl({ id: controlId, disabled, invalid: error !== undefined })

  return (
    <Field
      className={className}
      htmlFor={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      count={counterCount}
      max={max ?? maxLength}
      disabled={disabled}
    >
      <Input
        id={controlId}
        value={value}
        invalid={error !== undefined}
        disabled={disabled}
        aria-required={required || undefined}
        aria-describedby={control['aria-describedby']}
        {...inputProps}
      />
    </Field>
  )
}
