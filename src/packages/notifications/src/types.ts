import type { ReactNode } from 'react'

/** Семантические варианты уведомления. */
export type NotificationVariant = 'success' | 'error' | 'warning' | 'info' | 'loading'

/** Кнопка действия внутри уведомления. */
export interface NotifyAction {
  label: string
  onClick: () => void
}

/** Содержимое и поведение уведомления. */
export interface NotifyOptions {
  /** Заголовок уведомления. */
  title: ReactNode
  /** Поясняющий текст под заголовком. */
  message?: ReactNode
  /** Кнопка действия, например «Отменить» или «Повторить». */
  action?: NotifyAction
  /** Показывать кнопку закрытия. По умолчанию — нет. */
  closeButton?: boolean
  /** Время жизни в мс; `Infinity` — не закрывать автоматически. */
  duration?: number
  /** Разрешить закрытие свайпом. По умолчанию — да (поведение sonner). */
  dismissible?: boolean
  /** Идентификатор для управления конкретным уведомлением. */
  id?: number | string
}

/** Ручка управления показанным уведомлением. */
export interface NotifyHandle {
  id: number | string
  /** Закрыть уведомление. */
  dismiss: () => void
}

/** Сообщения для `notifyPromise`: значение или функция от результата. */
export interface NotifyPromiseMessages<T> {
  loading: ReactNode
  success: ReactNode | ((data: T) => ReactNode)
  error: ReactNode | ((error: unknown) => ReactNode)
}
