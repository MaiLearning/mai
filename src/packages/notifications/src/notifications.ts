import type { ReactNode } from 'react'
import { notify, resolveOptions } from './notify'
import type { NotifyHandle, NotifyOptions, NotifyPromiseMessages } from './types'

export function notifySuccess(options: NotifyOptions): NotifyHandle
export function notifySuccess(title: ReactNode, message?: ReactNode): NotifyHandle
export function notifySuccess(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyHandle {
  return notify('success', resolveOptions(titleOrOptions, message))
}

export function notifyError(options: NotifyOptions): NotifyHandle
export function notifyError(title: ReactNode, message?: ReactNode): NotifyHandle
export function notifyError(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyHandle {
  return notify('error', resolveOptions(titleOrOptions, message))
}

export function notifyConflict(options: NotifyOptions): NotifyHandle
export function notifyConflict(title: ReactNode, message?: ReactNode): NotifyHandle
export function notifyConflict(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyHandle {
  return notify('warning', resolveOptions(titleOrOptions, message))
}

/** Описательный алиас `notifyConflict`. */
export const notifyWarning: typeof notifyConflict = notifyConflict

export function notifyInfo(options: NotifyOptions): NotifyHandle
export function notifyInfo(title: ReactNode, message?: ReactNode): NotifyHandle
export function notifyInfo(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyHandle {
  return notify('info', resolveOptions(titleOrOptions, message))
}

export function notifyLoading(options: NotifyOptions): NotifyHandle
export function notifyLoading(title: ReactNode, message?: ReactNode): NotifyHandle
export function notifyLoading(
  titleOrOptions: ReactNode | NotifyOptions,
  message?: ReactNode,
): NotifyHandle {
  return notify('loading', {
    ...resolveOptions(titleOrOptions, message),
    duration: Number.POSITIVE_INFINITY,
  })
}

/**
 * Уведомление о промис-операции: держит состояние загрузки, затем
 * заменяет его на успех или ошибку. Возвращает исходный промис,
 * чтобы вызывающий код продолжил цепочку.
 */
export async function notifyPromise<T>(
  promise: Promise<T>,
  messages: NotifyPromiseMessages<T>,
): Promise<T> {
  const handle = notifyLoading(messages.loading)

  try {
    const data = await promise
    handle.dismiss()
    notifySuccess(
      typeof messages.success === 'function' ? messages.success(data) : messages.success,
    )

    return data
  } catch (error) {
    handle.dismiss()
    notifyError(typeof messages.error === 'function' ? messages.error(error) : messages.error)
    throw error
  }
}
