import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

// Кнопка-иконка; className прокидывается на button для styled(IconButton)
export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  label?: string
}
export function IconButton({ label, children, className, ...props }: IconButtonProps) {
  return (
    <Root aria-label={label} className={className} {...props}>
      {children}
    </Root>
  )
}
const Root = styled.button`
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: inherit;
  &:hover {
    background: ${({ theme }) => theme.background.accentSubtle};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
  }
`
