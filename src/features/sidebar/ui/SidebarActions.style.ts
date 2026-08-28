import styled, { css } from 'styled-components'

export const Bar = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`

export const ActionButton = styled.button<{ $variant: 'primary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 6px 12px 6px 9px;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? css`
          border: 1px solid transparent;
          background: ${theme.colors.primary};
          color: ${theme.colors.textOnPrimary};

          &:hover:not(:disabled) {
            background: ${theme.colors.primaryHover};
          }
        `
      : css`
          border: 1px solid ${theme.colors.border};
          background: transparent;
          color: ${theme.colors.textMuted};

          &:hover:not(:disabled) {
            border-color: ${theme.colors.borderStrong};
            background: ${theme.colors.surfaceElevated};
            color: ${theme.colors.text};
          }
        `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

export const MenuWrap = styled.div`
  position: relative;
  margin-left: auto;
`

export const MoreButton = styled.button<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $open, theme }) => ($open ? theme.colors.surfaceElevated : 'transparent')};
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
  }
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 20;
  min-width: 190px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: 7px 9px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  font-weight: 500;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primarySurface};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
