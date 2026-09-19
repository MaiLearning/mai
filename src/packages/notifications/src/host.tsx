import { Toaster } from 'sonner'

/**
 * Хост уведомлений. Монтируется один раз в корне приложения.
 * Содержимое тостов берёт тему из styled-components-контекста, поэтому
 * схеме sonner достаточно системного значения по умолчанию.
 */
export function NotificationsHost() {
  return <Toaster position="bottom-right" gap={12} offset={24} visibleToasts={4} />
}
