import type { ComponentPropsWithoutRef } from 'react'
import { ContainerInner, ContainerRoot } from './container.style'

/** Ступени шкалы ширин `theme.layout.containerWidths`. */
export type ContainerSize = 'narrow' | 'read' | 'code' | 'wide'

export interface ContainerProps extends Omit<ComponentPropsWithoutRef<'div'>, 'color'> {
  /**
   * Потолок ширины контента. По умолчанию `wide` — ширина каркаса
   * страницы; остальные ступени уже и подходят под конкретное содержимое.
   */
  size?: ContainerSize
  /**
   * Снять потолок: контейнер занимает всю ширину родителя. Горизонтальные
   * отступы при этом сохраняются.
   */
  fluid?: boolean
  /** Семантический тег внешнего слоя. */
  as?: 'div' | 'main' | 'section' | 'article' | 'aside'
}

/**
 * Центрированная область ограниченной ширины — специализация `Box`.
 *
 * Три обязанности: потолок ширины из шкалы `layout.containerWidths`,
 * центрирование по горизонтали и горизонтальные отступы, которые растут
 * вместе с контейнером. Адаптивные отступы считаются контейрным запросом
 * от самого контейнера, поэтому потребителю не нужно заводить своё имя
 * и переписывать правило на каждой странице.
 */
export function Container({
  size = 'wide',
  fluid = false,
  as,
  children,
  ...divProps
}: ContainerProps) {
  return (
    <ContainerRoot $size={size} $fluid={fluid} as={as} {...divProps}>
      <ContainerInner>{children}</ContainerInner>
    </ContainerRoot>
  )
}
