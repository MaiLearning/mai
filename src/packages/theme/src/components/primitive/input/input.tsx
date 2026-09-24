import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { InputContainer, InputControl } from './input.style'

export { InputAdornmentButton } from './input.style'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'className'> {
  size?: InputSize
  /** Переводит контрол в состояние ошибки: danger-граница + aria-invalid. */
  invalid?: boolean
  /** Контент слева внутри группы (иконка, префикс). */
  startContent?: ReactNode
  /** Контент справа внутри группы (глаз пароля, кнопка очистки, степперы). */
  endContent?: ReactNode
  className?: string
}

/**
 * Примитив ввода одной строки. Обёртка над нативным `<input>`: все
 * стандартные атрибуты (value, onChange, placeholder, disabled, maxLength
 * и т.д.) пробрасываются напрямую. Визуал несёт контейнер-группа, который
 * вместе с input рендерит опциональные startContent/endContent (адорнменты),
 * фокус-кольцо и hover/disabled-состояния. Собирается в поля через `Field`.
 *
 * @example
 * <Input placeholder="Имя" invalid={error !== undefined} />
 * <Input endContent={<InputAdornmentButton>…</InputAdornmentButton>} />
 */
export function Input({
  size = 'md',
  invalid = false,
  disabled = false,
  startContent,
  endContent,
  className,
  ...inputProps
}: InputProps) {
  return (
    <InputContainer className={className} $size={size} $invalid={invalid} $disabled={disabled}>
      {startContent}
      <InputControl {...inputProps} disabled={disabled} aria-invalid={invalid || undefined} />
      {endContent}
    </InputContainer>
  )
}
