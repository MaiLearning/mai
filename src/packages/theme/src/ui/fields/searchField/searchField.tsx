import type { ChangeEvent, ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { styled } from 'styled-components'
import type { FieldProps } from '../../base/field/field'
import { Field } from '../../base/field/field'
import { FieldAdornmentButton, FieldInputRoot } from '../../base/field/fieldInput.style'
import { CloseIcon } from '../../icons/icons/close'

export interface SearchFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type' | 'max'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className'> {
  id?: string
  className?: string
}

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & > input {
    padding-right: 34px;
  }

  & > button {
    position: absolute;
    right: ${({ theme }) => theme.spacing.sm};
  }
`

/**
 * Поисковое поле. Обёртка `Field` + нативный `<input type="search">` с
 * кнопкой очистки «✕» справа: появляется при непустом значении и очищает
 * его через `onChange` (с пустой строкой). Управляется извне (`value` +
 * `onChange`).
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

  const hasValue = typeof value === 'string' && value.length > 0

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
      <SearchWrapper>
        <FieldInputRoot
          id={controlId}
          type="search"
          value={value}
          $invalid={error !== undefined}
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-required={required || undefined}
          aria-describedby={hint || error ? `${controlId}-message` : undefined}
          {...inputProps}
          onChange={onChange}
        />
        <FieldAdornmentButton
          type="button"
          aria-label="Очистить поиск"
          disabled={disabled || !hasValue}
          tabIndex={hasValue ? 0 : -1}
          onClick={() => onChange?.({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)}
        >
          <CloseIcon />
        </FieldAdornmentButton>
      </SearchWrapper>
    </Field>
  )
}
