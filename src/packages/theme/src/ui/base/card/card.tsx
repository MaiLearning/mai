import type { HTMLAttributes } from 'react'
import { CardRoot } from './card.style'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Hover-эффект (подъём + тень). Для статичных карточек — false. */
  interactive?: boolean
  /** Семантический тег корня. */
  as?: 'article' | 'div' | 'section'
}

/**
 * Базовый контейнер карточки — основа всех карточек проекта.
 * Содержимое (обложка, тело, футер) собирает потребитель.
 */
export function Card({ interactive = true, as, ...rest }: CardProps) {
  return <CardRoot {...rest} as={as} $interactive={interactive} />
}
