import styled, { css } from 'styled-components'
import type { BadgeVariant } from './Badge'

export const Root = styled.span<{ $variant: BadgeVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 5px 11px;
  border-radius: ${({ theme }) => theme.radius.full};

  ${({ theme, $variant }) => {
    const map: Record<BadgeVariant, { bg: string; color: string }> = {
      primary: { bg: theme.background.accentSubtle, color: theme.text.accent },
      accent: { bg: theme.background.accentSubtle, color: theme.text.accent },
      success: { bg: theme.status.success.background, color: theme.status.success.foreground },
      danger: { bg: theme.status.danger.background, color: theme.status.danger.foreground },
      neutral: { bg: theme.background.surface, color: theme.text.muted },
    }
    const s = map[$variant]

    return css`
      background: ${s.bg};
      color: ${s.color};
    `
  }}
`
