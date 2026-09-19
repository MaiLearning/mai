import type { HTMLAttributes, ReactNode } from 'react'
import { Root } from './Badge.style'

export type BadgeVariant = 'primary' | 'accent' | 'neutral' | 'success' | 'danger'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({ variant = 'primary', ...props }: BadgeProps) {
  return <Root $variant={variant} {...props} />
}
