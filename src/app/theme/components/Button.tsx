import type { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}
export function Button({ variant = 'primary', ...props }: ButtonProps) {
  return <Root $variant={variant} {...props} />
}
const Root = styled.button<{ $variant: ButtonProps['variant'] }>`
  padding: 9px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.primary : $variant === 'secondary' ? theme.colors.surface : 'transparent')};
  color: ${({ theme, $variant }) => ($variant === 'primary' ? theme.colors.textOnPrimary : theme.colors.text)};
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`
