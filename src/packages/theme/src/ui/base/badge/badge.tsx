import type { ReactNode } from 'react'
import type { IntentName } from '../../../base/theme'
import { BadgeRoot } from './badge.style'

export type BadgeTone = IntentName
export type BadgeVariant = 'soft' | 'solid'

export interface BadgeProps {
  /** Смысловая роль бейджа. */
  tone?: BadgeTone
  /** Стиль заливки: приглушённая подложка или насыщенная. */
  variant?: BadgeVariant
  children?: ReactNode
  className?: string
}

/**
 * Компактная метка статуса/категории. `soft` — tint-подложка с текстом
 * роли, `solid` — насыщенная заливка с контрастным текстом.
 */
export function Badge({ tone = 'neutral', variant = 'soft', children, className }: BadgeProps) {
  return (
    <BadgeRoot $tone={tone} $variant={variant} className={className}>
      {children}
    </BadgeRoot>
  )
}
