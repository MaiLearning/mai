import styled, { css } from 'styled-components'

export const Bar = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? css`
          border: 1px solid transparent;
          background: ${theme.background.accent};
          color: ${theme.text.onPrimary};

          &:hover:not(:disabled) {
            background: ${theme.background.accentHover};
          }
        `
      : css`
          border: 1px solid ${theme.border.default};
          background: transparent;
          color: ${theme.text.muted};

          &:hover:not(:disabled) {
            border-color: ${theme.border.strong};
            background: ${theme.background.elevated};
            color: ${theme.text.primary};
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
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $open, theme }) => ($open ? theme.background.elevated : 'transparent')};
  color: ${({ theme }) => theme.text.muted};
  transition: background ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) => theme.background.elevated};
    color: ${({ theme }) => theme.text.primary};
  }
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  min-width: 190px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.background.elevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: 7px 9px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 13px;
  font-weight: 500;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.background.accentSubtle};
    color: ${({ theme }) => theme.text.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
