import type { ComponentPropsWithoutRef } from 'react'
import { Text, type TextColor, type TextSize, type TextWeight } from '../text/text'

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

export interface HeadingProps extends Omit<ComponentPropsWithoutRef<'h2'>, 'color'> {
  /** Семантический уровень заголовка. */
  as?: HeadingLevel
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
}

/**
 * Заголовок секции. Композиция поверх `Text` с фиксированным набором
 * уровней `h1..h6` и дефолтной полужирной насыщенностью.
 */
export function Heading({
  as = 'h2',
  size = 'lg',
  weight = 'semibold',
  color = 'primary',
  children,
  ...domProps
}: HeadingProps) {
  return (
    <Text as={as} size={size} weight={weight} color={color} {...domProps}>
      {children}
    </Text>
  )
}
