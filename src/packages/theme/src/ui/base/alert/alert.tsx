import type { HTMLAttributes, ReactNode } from 'react'
import { ErrorIcon } from '../../icons/icons/error'
import { InfoIcon } from '../../icons/icons/info'
import { SuccessIcon } from '../../icons/icons/success'
import { WarningIcon } from '../../icons/icons/warning'
import { Icon } from '../icon/icon'
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
