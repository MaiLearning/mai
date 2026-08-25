import type { HTMLAttributes, ReactNode } from 'react'
import styled, { css } from 'styled-components'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  variant?: 'primary' | 'accent' | 'neutral' | 'success' | 'danger'
}
export function Badge({ variant = 'primary', ...props }: BadgeProps) {
  return <Root $variant={variant} {...props} />
}
const Root = styled.span<{ $variant: BadgeProps['variant'] }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.font.body};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 5px 11px;
  border-radius: ${({ theme }) => theme.radii.pill};

  ${({ theme, $variant }) => {
    const map: Record<string, { bg: string; color: string }> = {
      primary: { bg: theme.colors.primarySurface, color: theme.colors.primary },
      accent: { bg: theme.colors.accentSurface, color: theme.colors.accent },
      success: { bg: theme.colors.successSurface, color: theme.colors.success },
      danger: { bg: theme.colors.dangerSurface, color: theme.colors.danger },
      neutral: { bg: theme.colors.surface, color: theme.colors.textMuted },
    }
    const s = map[$variant ?? 'primary']

    return css`
      background: ${s.bg};
      color: ${s.color};
    `
  }}
`
