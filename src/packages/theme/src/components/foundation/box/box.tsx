import type { ComponentPropsWithoutRef } from 'react'
import { BoxRoot } from './box.style'

export interface BoxProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * Нейтральный блочный контейнер-обёртка. Позиционирование и раскладку
 * задаёт потребитель через обычные CSS-атрибуты; компонент лишь приводит
 * блочную модель к масштабу темы.
 */
export function Box({ ...divProps }: BoxProps) {
  return <BoxRoot {...divProps} />
}
