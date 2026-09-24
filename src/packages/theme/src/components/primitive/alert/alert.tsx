import { ErrorIcon, Icon, InfoIcon, SuccessIcon, WarningIcon } from '@mai/icons'
import type { HTMLAttributes, ReactNode } from 'react'
import { AlertIcon, AlertRoot } from './alert.style'

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: AlertVariant
  /** Своя иконка вместо тематической иконки варианта. */
  icon?: ReactNode
  /** Скрыть иконку варианта. */
  hideIcon?: boolean
}

export function Alert({
  variant = 'info',
  icon,
  hideIcon = false,
  children,
  ...props
}: AlertProps) {
  return (
    <AlertRoot $variant={variant} role="alert" {...props}>
      {!hideIcon && (
        <AlertIcon>
          <Icon size="sm">{icon ?? defaultIcons[variant]}</Icon>
        </AlertIcon>
      )}
      <>{children}</>
    </AlertRoot>
  )
}
