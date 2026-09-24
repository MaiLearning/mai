import type { ComponentPropsWithoutRef } from 'react'
import { useId } from 'react'
import { styled } from 'styled-components'
import type { FieldProps } from '../../../../src/components/pattern/field/field'
import { Field } from '../../../../src/components/pattern/field/field'
import { useFieldControl } from '../../../../src/components/pattern/field/fieldControl'
import { Input, InputAdornmentButton } from '../../../../src/components/primitive/input/input'

export interface NumberFieldProps
  extends Omit<ComponentPropsWithoutRef<'input'>, 'className' | 'type' | 'onChange' | 'size'>,
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

/** Скрывает нативные спины у `type="number"` — их заменяют степперы справа. */
const NumberInput = styled(Input)`
  & > input {
    appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

const StepperGroup = styled.div`
  display: flex;
  align-items: center;
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

  const control = useFieldControl({ id: controlId, disabled, invalid: error !== undefined })
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
      <NumberInput
        id={controlId}
        type="number"
        value={value ?? ''}
        step={stepNum}
        min={min}
        max={max}
        invalid={error !== undefined}
        disabled={disabled}
        aria-required={required || undefined}
        aria-describedby={control['aria-describedby']}
        endContent={
          showSteppers ? (
            <StepperGroup>
              <InputAdornmentButton
                type="button"
                aria-label="Уменьшить"
                disabled={disabled || atMin}
                onClick={() => apply(numericValue - stepNum)}
              >
                <MinusGlyph />
              </InputAdornmentButton>
              <InputAdornmentButton
                type="button"
                aria-label="Увеличить"
                disabled={disabled || atMax}
                onClick={() => apply(numericValue + stepNum)}
              >
                <PlusGlyph />
              </InputAdornmentButton>
            </StepperGroup>
          ) : undefined
        }
        {...inputProps}
        onChange={(e) => {
          const parsed = Number.parseFloat(e.target.value)
          onChange?.(Number.isNaN(parsed) ? 0 : parsed)
        }}
      />
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
