import {
  Button,
  CloseIcon,
  ErrorIcon,
  Icon,
  InfoIcon,
  Spinner,
  SuccessIcon,
  Text,
  WarningIcon,
} from '@mai/theme'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import {
  NotificationActions,
  NotificationClose,
  NotificationContent,
  NotificationIcon,
  NotificationRoot,
} from './NotificationCard.style'
import type { NotificationVariant, NotifyAction } from './types'

const variantIcons: Record<NotificationVariant, ReactNode> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
  loading: <Spinner />,
}

export interface NotificationCardProps {
  /** Идентификатор тоста sonner — нужен для закрытия. */
  id: number | string
  /** Семантический вариант уведомления. */
  variant: NotificationVariant
  /** Заголовок уведомления. */
  title: ReactNode
  /** Поясняющий текст под заголовком. */
  message?: ReactNode
  /** Кнопка действия. */
  action?: NotifyAction
  /** Показывать кнопку закрытия. */
  closeButton?: boolean
}

/**
 * Содержимое тоста: иконка варианта, тексты, действие и закрытие.
 * Рендерится внутри sonner через `toast.custom`, поэтому закрывается
 * через `toast.dismiss(id)`.
 */
export function NotificationCard({
  id,
  variant,
  title,
  message,
  action,
  closeButton = false,
}: NotificationCardProps) {
  const dismiss = () => toast.dismiss(id)

  return (
    <NotificationRoot $variant={variant} role="status">
      <NotificationIcon $variant={variant}>
        <Icon size="sm">{variantIcons[variant]}</Icon>
      </NotificationIcon>

      <NotificationContent>
        <Text size="sm" weight="semibold">
          {title}
        </Text>
        {message != null && message !== '' && (
          <Text size="sm" color="muted">
            {message}
          </Text>
        )}
      </NotificationContent>

      {(action || closeButton) && (
        <NotificationActions>
          {action && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                action.onClick()
                dismiss()
              }}
            >
              {action.label}
            </Button>
          )}
          {closeButton && (
            <NotificationClose type="button" aria-label="Закрыть уведомление" onClick={dismiss}>
              <Icon size="xs">
                <CloseIcon />
              </Icon>
            </NotificationClose>
          )}
        </NotificationActions>
      )}
    </NotificationRoot>
  )
}
