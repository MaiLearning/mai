import type { HTMLAttributes, ReactNode } from 'react'
import { IconRoot } from './icon.style'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  size?: IconSize
}

export function Icon({ children, size = 'md', ...props }: IconProps) {
  return (
    <IconRoot $size={size} {...props}>
      {children}
    </IconRoot>
  )
}
