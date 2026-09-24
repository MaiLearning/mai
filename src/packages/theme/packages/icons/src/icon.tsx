import type { HTMLAttributes, ReactNode } from 'react'
import { IconRoot, iconSizeMap } from './icon.style'
import type { IconName } from './registry'
import { iconRegistry } from './registry'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name?: IconName
  children?: ReactNode
  size?: IconSize | number
  strokeWidth?: number
}

export function Icon({ name, children, size = 'md', strokeWidth, ...props }: IconProps) {
  const px = typeof size === 'number' ? `${size}px` : iconSizeMap[size]
  const entry = name != null ? iconRegistry[name] : undefined
  const content = entry ? (
    <entry.Component size={px} strokeWidth={strokeWidth ?? entry.defaultStrokeWidth} />
  ) : (
    children
  )

  return (
    <IconRoot $size={px} {...props}>
      {content}
    </IconRoot>
  )
}
