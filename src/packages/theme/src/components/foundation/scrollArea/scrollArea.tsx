import type { ComponentPropsWithoutRef } from 'react'
import { ScrollAreaRoot } from './scrollArea.style'

export interface ScrollAreaProps extends ComponentPropsWithoutRef<'div'> {
  /** Фиксированная высота контейнера. */
  height?: string
  /** Максимальная высота: ниже — прокрутка, выше — растягивается. */
  maxHeight?: string
}

/**
 * Область прокрутки со стилизованным скроллбаром под тему.
 * Прозрачная обёртка над `<div>`: все стандартные атрибуты проходят насквозь.
 */
export function ScrollArea({ height, maxHeight, ...divProps }: ScrollAreaProps) {
  return <ScrollAreaRoot $height={height} $maxHeight={maxHeight} {...divProps} />
}
