import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Root } from './IconButton.style'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  label?: string
}

export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <Root aria-label={label} {...props}>
      {children}
    </Root>
  )
}
