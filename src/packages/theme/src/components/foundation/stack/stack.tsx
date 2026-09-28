import type { ComponentPropsWithoutRef } from 'react'
import type { SpacingKey } from '../../../base/theme'
import { StackRoot } from './stack.style'

export type StackDirection = 'vertical' | 'horizontal'
export type StackAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'

export interface StackProps extends Omit<ComponentPropsWithoutRef<'div'>, 'dir'> {
  /** Ось раскладки: элементы друг под другом или в ряд. */
  direction?: StackDirection
  /** Отступ между элементами: ключ каталога `theme.spacing` или число базовых шагов. */
  gap?: SpacingKey | number
  /** Выравнивание по поперечной оси. */
  align?: StackAlign
}

/**
 * Stack — основанный на flex-раскладке контейнер для вертикального
 * или горизонтального расположения элементов. Управляет осью и зазором
 * между дочерними элементами через токены темы; не знает о содержимом.
 */
export function Stack({ direction = 'vertical', gap, align, children, ...divProps }: StackProps) {
  return (
    <StackRoot $direction={direction} $gap={gap} $align={align} {...divProps}>
      {children}
    </StackRoot>
  )
}
