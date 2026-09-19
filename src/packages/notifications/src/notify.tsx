import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { NotificationCard } from './NotificationCard'
import type { NotificationVariant, NotifyHandle, NotifyOptions } from './types'

/** Время жизни обычного уведомления по умолчанию, мс. */
const DEFAULT_DURATION = 4000

/** Отличает options-объект от ReactNode-заголовка. */
export function isOptions(value: ReactNode | NotifyOptions): value is NotifyOptions {
  return typeof value === 'object' && value !== null && 'title' in value && !('$$typeof' in value)
}

/** Нормализует пару «заголовок, сообщение» в options-объект. */
export function resolveOptions(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyOptions {
  return isOptions(titleOrOptions) ? titleOrOptions : { title: titleOrOptions, message }
}

/** Показывает кастомный тост и возвращает ручку управления. */
export function notify(variant: NotificationVariant, options: NotifyOptions): NotifyHandle {
  const id = toast.custom(
    (toastId) => (
      <NotificationCard
        id={toastId}
        variant={variant}
        title={options.title}
        message={options.message}
        action={options.action}
        closeButton={options.closeButton}
      />
    ),
    {
      id: options.id,
      duration: options.duration ?? DEFAULT_DURATION,
      dismissible: options.dismissible,
    },
  )

  return { id, dismiss: () => toast.dismiss(id) }
}
