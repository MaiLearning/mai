import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
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
const Root = styled.button`
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: inherit;
  &:hover {
    background: ${({ theme }) => theme.colors.primarySurface};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
  }
`
