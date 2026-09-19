import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { Spinner } from '../spinner/spinner'
import { ButtonRoot } from './button.style'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  loading?: boolean
  selected?: boolean
  onlyIcon?: ReactNode
  startIcon?: ReactNode
  endIcon?: ReactNode
}

export function Button({
  children,
  size = 'md',
  variant = 'primary',
  loading = false,
  selected,
  disabled = false,
  onlyIcon,
  startIcon,
  endIcon,
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <ButtonRoot
      {...buttonProps}
      $size={size}
      $variant={variant}
      $selected={selected ?? false}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-pressed={selected === undefined ? undefined : selected}
    >
      {loading && <Spinner label="Загрузка" />}
      {onlyIcon != null && <Icon>{onlyIcon}</Icon>}
      {startIcon != null && <Icon>{startIcon}</Icon>}
      {children}
      {endIcon != null && <Icon>{endIcon}</Icon>}
    </ButtonRoot>
  )
}
