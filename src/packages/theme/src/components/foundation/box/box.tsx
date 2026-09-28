import type { ComponentPropsWithoutRef } from 'react'
import { BoxRoot } from './box.style'

export interface BoxProps extends ComponentPropsWithoutRef<'div'> {
  /** Семантический тег корня. По умолчанию `div`. */
  as?: 'div' | 'section' | 'main' | 'article' | 'header' | 'footer' | 'aside' | 'nav'
}

/**
 * Нейтральный блочный контейнер — **база всех layout-компонентов фонда**.
 *
 * Собственных правил раскладки не имеет: приводит блочную модель к
 * масштабу темы (`box-sizing`, сброс полей, `min-width: 0`) и служит
 * точкой подключения для специализаций. Например `Container` — это `Box`
 * с потолком ширины, центрированием и горизонтальными отступами.
 *
 * Всё, что не нормализация блока (отступы, размеры, ось раскладки), —
 * зона специализаций: `Container`, `Flex`, `Stack`.
 */
export function Box({ as, ...divProps }: BoxProps) {
  return <BoxRoot as={as} {...divProps} />
}
