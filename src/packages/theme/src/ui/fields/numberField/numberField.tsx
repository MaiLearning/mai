import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { styled } from 'styled-components'
import type { FieldProps } from '../../base/field/field'
import { Field } from '../../base/field/field'
import { FieldAdornmentButton, FieldInputRoot } from '../../base/field/fieldInput.style'

export interface NumberFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type' | 'onChange'>,
    Omit<FieldProps, 'htmlFor' | 'children' | 'className' | 'count' | 'max'> {
  /** Текущее числовое значение. */
  value?: number
  /** Вызывается с новым числовым значением при вводе или клике по степперам. */
  onChange?: (value: number) => void
  /** Показывать степперы −/+ справа. */
  showSteppers?: boolean
  id?: string
  className?: string
}

const NumberWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  & > input {
    padding-right: 64px;
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const StepperGroup = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xs};
  display: flex;
  gap: 2px;

  & > button {
    width: 24px;
  }
`

/**
 * Числовое поле. Обёртка `Field` + нативный `<input type="number">` со
 * степперами −/+ справа (инкремент по `step`, учитывается `min`/`max`).
 * Значение — число: `value?: number`, `onChange(value: number)`.
 *
 * @example
 * <NumberField label="Порядок" value={order} onChange={setOrder} min={1} max={100} step={5} />
 */
export function NumberField({
  id,
  className,
  label,
  required,
  hint,
  error,
  disabled,
  showSteppers = true,
  value,
  onChange,
  step = 1,
  min,
  max,
  ...inputProps
}: NumberFieldProps) {
  const internalId = useId()
  const controlId = id ?? internalId

  const minNum = min !== undefined ? Number(min) : undefined
  const maxNum = max !== undefined ? Number(max) : undefined
  const stepNum = Number(step) || 1

  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : NaN
  const atMin = minNum !== undefined && numericValue <= minNum
  const atMax = maxNum !== undefined && numericValue >= maxNum

  const apply = (next: number) => {
    const from = Number.isFinite(next) ? next : (minNum ?? 0)
    const bounded = maxNum !== undefined ? Math.min(from, maxNum) : from
    const withMin = minNum !== undefined ? Math.max(bounded, minNum) : bounded
    onChange?.(withMin)
  }

  return (
    <Field
      className={className}
      htmlFor={controlId}
      label={label}
      required={required}
      hint={hint}
      error={error}
      disabled={disabled}
    >
      <NumberWrapper>
        <FieldInputRoot
          id={controlId}
          type="number"
          value={value ?? ''}
          step={stepNum}
          min={min}
          max={max}
          $invalid={error !== undefined}
          disabled={disabled}
          aria-invalid={error !== undefined}
          aria-required={required || undefined}
          aria-describedby={hint || error ? `${controlId}-message` : undefined}
          {...inputProps}
          onChange={(e) => {
            const parsed = Number.parseFloat(e.target.value)
            onChange?.(Number.isNaN(parsed) ? 0 : parsed)
          }}
        />
        {showSteppers ? (
          <StepperGroup>
            <FieldAdornmentButton
              type="button"
              aria-label="Уменьшить"
              disabled={disabled || atMin}
              onClick={() => apply(numericValue - stepNum)}
            >
              <MinusGlyph />
            </FieldAdornmentButton>
            <FieldAdornmentButton
              type="button"
              aria-label="Увеличить"
              disabled={disabled || atMax}
              onClick={() => apply(numericValue + stepNum)}
            >
              <PlusGlyph />
            </FieldAdornmentButton>
          </StepperGroup>
        ) : null}
      </NumberWrapper>
    </Field>
  )
}

function MinusGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  )
}

function PlusGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  )
}
