import type { ReactNode } from 'react'
import { TooltipRoot } from './tooltip.style'

export interface TooltipProps {
  /** Содержимое, к которому крепится подсказка. */
  children: ReactNode
  /** Текст подсказки. */
  content: string
  className?: string
}

/**
 * Обёртка с нативной подсказкой браузера: показывает `content` через
 * атрибут `title`. Не рисует собственную всплывающую панель и не управляет
 * состояниями — поведение отдано браузеру.
 */
export function Tooltip({ children, content, className }: TooltipProps) {
  return (
    <TooltipRoot title={content} className={className}>
      {children}
    </TooltipRoot>
  )
}
