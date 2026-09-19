import styled, { css } from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { ButtonSize, ButtonVariant } from './button'

export interface ButtonRootProps {
  $size: ButtonSize
  $variant: ButtonVariant
  $selected: boolean
}

function sizeStyles(theme: AppTheme, size: ButtonSize) {
  const styles: Record<ButtonSize, ReturnType<typeof css>> = {
    xs: css`
      min-height: 24px;
      padding: 0 8px;
      font-size: ${theme.typography.sizes.xs};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    sm: css`
      min-height: 32px;
      padding: 0 12px;
      font-size: ${theme.typography.sizes.sm};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    md: css`
      min-height: 36px;
      padding: 0 16px;
      font-size: ${theme.typography.sizes.md};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    lg: css`
      min-height: 40px;
      padding: 0 18px;
      font-size: ${theme.typography.sizes.lg};
      line-height: ${theme.typography.lineHeights.normal};
    `,
    xl: css`
      min-height: 48px;
      padding: 0 20px;
      font-size: ${theme.typography.sizes.xl};
      line-height: ${theme.typography.lineHeights.normal};
    `,
  }

  return styles[size]
}

function variantStyles(theme: AppTheme, variant: ButtonVariant) {
  const styles: Record<ButtonVariant, ReturnType<typeof css>> = {
    primary: css`
      background: ${theme.background.accent};
      color: ${theme.text.onPrimary};

      &:hover {
        background: ${theme.background.accentHover};
      }

      &:active {
        background: ${theme.background.accentHover};
      }
    `,
    secondary: css`
      background: ${theme.background.surface};
      border: 1px solid ${theme.border.default};
      color: ${theme.text.primary};

      &:hover {
        background: ${theme.background.hover};
        border-color: ${theme.border.strong};
      }
    `,
    danger: css`
      background: ${theme.status.danger.background};
      border: 1px solid ${theme.status.danger.foreground}33;
      color: ${theme.status.danger.foreground};

      &:hover {
        background: ${theme.status.danger.background};
        border-color: ${theme.status.danger.foreground};
      }
    `,
    ghost: css`
      background: transparent;
      color: ${theme.text.primary};

      &:hover {
        background: ${theme.background.hover};
      }
    `,
    outline: css`
      border: 1px solid ${theme.border.default};
      background: transparent;
      color: ${theme.text.primary};

      &:hover {
        background: ${theme.background.hover};
        border-color: ${theme.border.strong};
      }
    `,
  }

  return styles[variant]
}

export const ButtonRoot = styled.button<ButtonRootProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-weight: ${({ theme }) => theme.typography.weights.medium};

  cursor: pointer;
  user-select: none;

  transition:
    background-color ${({ theme }) => theme.durations.fast} ease,
    border-color ${({ theme }) => theme.durations.fast} ease,
    transform ${({ theme }) => theme.durations.fast} ease;

  ${({ theme, $size }) => sizeStyles(theme, $size)}
  ${({ theme, $variant }) => variantStyles(theme, $variant)}

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${({ theme }) => theme.background.disabled};
    border-color: ${({ theme }) => theme.border.default};
    color: ${({ theme }) => theme.text.muted};
    opacity: 1;
    cursor: not-allowed;
    transform: none;
  }

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.background.selected};
    border-color: ${({ theme }) => theme.border.accent};
    color: ${({ theme }) => theme.text.accent};
  }
`
