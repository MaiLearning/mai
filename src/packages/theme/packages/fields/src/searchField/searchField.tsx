import { Icon } from '@mai/icons'
import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import type { FieldProps } from '../../../../src/components/pattern/field/field'
import { Field } from '../../../../src/components/pattern/field/field'
import { Input } from '../../../../src/components/primitive/input/input'

export interface SearchFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type' | 'max' | 'size'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className'> {
  id?: string
  className?: string
}

/**
 * Поисковое поле. Обёртка `Field` + нативный `<input type="search">` с
 * иконкой лупы справа. Управляется извне (`value` + `onChange`).
 *
 * @example
 * <SearchField value={query} onChange={(e) => setQuery(e.target.value)} />
 */
export function SearchField({
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
  onChange,
  ...inputProps
}: SearchFieldProps) {
  const internalId = useId()
  const controlId = id ?? internalId

  return (
    <Field
      className={className}
      htmlFor={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      count={count}
      max={max}
      disabled={disabled}
    >
      <Input
        id={controlId}
        type="search"
        value={value}
        invalid={error !== undefined}
        disabled={disabled}
        aria-required={required || undefined}
        aria-describedby={hint || error ? `${controlId}-message` : undefined}
        endContent={<Icon name="search" size="sm" aria-hidden="true" />}
        {...inputProps}
        onChange={onChange}
      />
    </Field>
  )
}
