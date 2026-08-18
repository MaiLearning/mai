import { toast } from 'sonner'

/**
 * Единая абстракция уведомлений через sonner.
 * Используются во всех UI-операциях для обратной связи пользователю.
 */

export function notifySuccess(title: string, message?: string): void {
  toast.success(title, { description: message })
}

export function notifyError(title: string, message?: string): void {
  toast.error(title, { description: message })
}

export function notifyConflict(title: string, message?: string): void {
  toast.warning(title, { description: message })
}
