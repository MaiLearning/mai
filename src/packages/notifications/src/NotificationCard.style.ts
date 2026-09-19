import type { AppTheme } from '@mai/theme'
import styled, { css } from 'styled-components'
import type { NotificationVariant } from './types'

/** Цвет акцента варианта: статусный токен или акцент темы для загрузки. */
function accent(theme: AppTheme, variant: NotificationVariant): string {
  if (variant === 'loading') return theme.text.accent
  const status = variant === 'error' ? 'danger' : variant

  return theme.status[status].foreground
}

function borderStyle(theme: AppTheme, variant: NotificationVariant) {
  return css`
    border-color: ${accent(theme, variant)}33;
  `
}

export const NotificationRoot = styled.div<{ $variant: NotificationVariant }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  box-sizing: border-box;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.background.elevated};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};

  ${({ theme, $variant }) => borderStyle(theme, $variant)}
`

export const NotificationIcon = styled.span<{ $variant: NotificationVariant }>`
  display: inline-flex;
  flex: 0 0 auto;
  margin-top: 1px;
  color: ${({ theme, $variant }) => accent(theme, $variant)};
`

export const NotificationContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const NotificationActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

export const NotificationClose = styled.button`
  display: inline-flex;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.text.muted};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.text.primary};
    background: ${({ theme }) => theme.background.hover};
  }
`
