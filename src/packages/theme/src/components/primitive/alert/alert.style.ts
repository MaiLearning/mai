import styled, { css } from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { AlertVariant } from './alert'

export interface AlertStyledProps {
  $variant: AlertVariant
}

function variantStyle(theme: AppTheme, variant: AlertVariant) {
  const map: Record<AlertVariant, { border: string; color: string }> = {
    error: {
      border: theme.utils.getBorder('danger', 'default'),
      color: theme.utils.getText('danger', 'primary'),
    },
    warning: {
      border: theme.utils.getBorder('warning', 'default'),
      color: theme.utils.getText('warning', 'primary'),
    },
    success: {
      border: theme.utils.getBorder('success', 'default'),
      color: theme.utils.getText('success', 'primary'),
    },
    info: {
      border: theme.utils.getBorder('info', 'default'),
      color: theme.utils.getText('info', 'primary'),
    },
  }
  const s = map[variant]

  return css`
    border-color: ${s.border};
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
