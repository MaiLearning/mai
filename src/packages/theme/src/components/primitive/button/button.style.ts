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
      background: ${theme.utils.getSolid('accent', 'base')};
      color: ${theme.contrastText.accent};

      &:hover {
        background: ${theme.utils.getSolid('accent', 'hover')};
      }

      &:active {
        background: ${theme.utils.getSolid('accent', 'hover')};
      }
    `,
    secondary: css`
      background: ${theme.utils.getBackground('neutral', 'raised')};
      border: 1px solid ${theme.utils.getBorder('neutral', 'default')};
      color: ${theme.utils.getText('neutral', 'primary')};

      &:hover {
        background: ${theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'hoverAlpha')};
        border-color: ${theme.utils.withState(theme.utils.getBorder('neutral', 'default'), 'hoverAlpha')};
      }
    `,
    danger: css`
      background: ${theme.utils.getBackground('danger', 'surface')};
      border: 1px solid ${theme.utils.getBorder('danger', 'default')};
      color: ${theme.utils.getText('danger', 'primary')};

      &:hover {
        background: ${theme.utils.withState(theme.utils.getBackground('danger', 'surface'), 'hoverAlpha')};
        border-color: ${theme.utils.withState(theme.utils.getBorder('danger', 'default'), 'hoverAlpha')};
      }
    `,
    ghost: css`
      background: transparent;
      color: ${theme.utils.getText('neutral', 'primary')};

      &:hover {
        background: ${theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
      }
    `,
    outline: css`
      border: 1px solid ${theme.utils.getBorder('neutral', 'default')};
      background: transparent;
      color: ${theme.utils.getText('neutral', 'primary')};

      &:hover {
        background: ${theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
        border-color: ${theme.utils.withState(theme.utils.getBorder('neutral', 'default'), 'hoverAlpha')};
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
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    opacity: 1;
    cursor: not-allowed;
    transform: none;
  }

  &[aria-pressed='true'] {
    background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')};
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }
`
