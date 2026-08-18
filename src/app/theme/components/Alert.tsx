import type { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'error' | 'warning' | 'info' | 'success'
}
export function Alert({ variant = 'info', ...props }: AlertProps) {
  return <Root $variant={variant} role="alert" {...props} />
}
const Root = styled.div<{ $variant: AlertProps['variant'] }>`
  padding: 12px 14px;
  border: 1px solid
    ${({ theme, $variant }) => theme.colors[`${$variant}Surface` as keyof typeof theme.colors]};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $variant }) => theme.colors[`${$variant}Surface` as keyof typeof theme.colors]};
  color: ${({ theme }) => theme.colors.text};
`
