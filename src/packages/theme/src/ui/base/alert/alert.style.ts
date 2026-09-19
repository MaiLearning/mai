import styled, { css } from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { AlertVariant } from './alert'

export interface AlertStyledProps {
  $variant: AlertVariant
}

function variantStyle(theme: AppTheme, variant: AlertVariant) {
  const map: Record<AlertVariant, { border: string; color: string }> = {
    error: { border: theme.status.danger.foreground, color: theme.status.danger.foreground },
    warning: { border: theme.status.warning.foreground, color: theme.status.warning.foreground },
    success: { border: theme.status.success.foreground, color: theme.status.success.foreground },
    info: { border: theme.status.info.foreground, color: theme.status.info.foreground },
  }
  const s = map[variant]

  return css`
    border-color: ${s.border}33;
    color: ${s.color};
  `
}

export const AlertRoot = styled.div<AlertStyledProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};

  ${({ theme, $variant }) => variantStyle(theme, $variant)}
`

/** Обёртка иконки уведомления: наследует цвет текста варианта. */
export const AlertIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
`
