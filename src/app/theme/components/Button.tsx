import type { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'dangerSoft'
  size?: 'sm' | 'md' | 'lg'
}
export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return <Root $variant={variant} $size={size} {...props} />
}
const Root = styled.button<{ $variant: ButtonProps['variant']; $size: ButtonProps['size'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-family: ${({ theme }) => theme.font.body};
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.12s ease, background 0.16s ease, box-shadow 0.16s ease, color 0.16s ease;
  white-space: nowrap;

  svg {
    flex-shrink: 0;
  }

  ${({ $size }) =>
    $size === 'lg'
      ? css`
          font-size: 16px;
          padding: 14px 26px;
        `
      : $size === 'sm'
        ? css`
            font-size: 13px;
            padding: 6px 12px;
          `
        : css`
            font-size: 14px;
            padding: 10px 18px;
          `}

  ${({ theme, $variant }) => {
    if ($variant === 'ghost')
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border-color: ${theme.colors.border};
        &:hover { background: ${theme.colors.surface}; }
      `
    if ($variant === 'soft')
      return css`
        background: ${theme.colors.primarySurface};
        color: ${theme.colors.primary};
        &:hover { background: ${theme.colors.primarySurface}dd; }
      `
    if ($variant === 'secondary')
      return css`
        background: ${theme.colors.surface};
        color: ${theme.colors.text};
        border-color: ${theme.colors.border};
        &:hover { background: ${theme.colors.border}; }
      `
    if ($variant === 'danger')
      return css`
        background: ${theme.colors.danger};
        color: #fff;
        &:hover { background: ${theme.colors.dangerHover}; }
      `
    if ($variant === 'dangerSoft')
      return css`
        background: ${theme.colors.dangerSurface};
        color: ${theme.colors.danger};
        &:hover { background: ${theme.colors.danger}; color: #fff; }
      `
    return css`
      background: ${theme.colors.primary};
      color: ${theme.colors.textOnPrimary};
      box-shadow: ${theme.shadows.sm};
      &:hover { background: ${theme.colors.primaryHover}; box-shadow: ${theme.shadows.md}; }
    `
  }}

  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; pointer-events: none; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
`
