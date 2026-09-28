import type { ComponentPropsWithoutRef } from 'react'
import type { SpacingKey } from '../../../base/theme'
import { FlexRoot } from './flex.style'

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
export type FlexJustify =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export interface FlexProps extends Omit<ComponentPropsWithoutRef<'div'>, 'wrap'> {
  direction?: FlexDirection
  align?: FlexAlign
  justify?: FlexJustify
  wrap?: FlexWrap
  /** Отступ между элементами: ключ каталога `theme.spacing` или число базовых шагов. */
  gap?: SpacingKey | number
}

/**
 * Flex-контейнер раскладки. Управляет направлением, выравниванием,
 * переносом и зазором между дочерними элементами через токены темы.
 */
export function Flex({
  direction = 'row',
  align,
  justify,
  wrap = 'nowrap',
  gap,
  children,
  ...divProps
}: FlexProps) {
  return (
    <FlexRoot
      $direction={direction}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      $gap={gap}
      {...divProps}
    >
      {children}
    </FlexRoot>
  )
}
