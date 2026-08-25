import type { HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'error' | 'warning' | 'info' | 'success'
}
export function Alert({ variant = 'info', ...props }: AlertProps) {
  return <Root $variant={variant} role="alert" {...props} />
}
const Root = styled.div<{ $variant: AlertProps['variant'] }>`
  padding: 14px 16px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: ${({ theme }) => theme.font.body};

  ${({ theme, $variant }) => {
    const map: Record<string, { bg: string; border: string; color: string }> = {
      error: {
        bg: theme.colors.dangerSurface,
        border: theme.colors.danger,
        color: theme.colors.danger,
      },
      warning: {
        bg: theme.colors.warningSurface,
        border: theme.colors.warning,
        color: theme.colors.warning,
      },
      success: {
        bg: theme.colors.successSurface,
        border: theme.colors.success,
        color: theme.colors.success,
      },
      info: { bg: theme.colors.infoSurface, border: theme.colors.info, color: theme.colors.info },
    }
    const s = map[$variant ?? 'info']

    return css`
      background: ${s.bg};
      border-color: ${s.border}33;
      color: ${s.color};
    `
  }}
`
