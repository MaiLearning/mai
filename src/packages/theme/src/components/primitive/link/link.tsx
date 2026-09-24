import type { ComponentPropsWithoutRef } from 'react'
import type { TextColor } from '../../foundation/text/text'
import { LinkRoot } from './link.style'

export interface LinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'color'> {
  color?: TextColor
  /** Режим подчёркивания: всегда / при наведении / никогда. */
  underline?: 'always' | 'hover' | 'none'
}

/**
 * Ссылка навигации. По умолчанию — акцентный цвет с подчёркиванием
 * при наведении; внешние ссылки получают `target="_blank"`.
 */
export function Link({
  color = 'accent',
  underline = 'hover',
  children,
  ...anchorProps
}: LinkProps) {
  return (
    <LinkRoot
      $color={color}
      $underline={underline}
      {...(anchorProps.href?.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...anchorProps}
    >
      {children}
    </LinkRoot>
  )
}
