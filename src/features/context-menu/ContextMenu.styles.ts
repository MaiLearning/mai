import styled, { keyframes } from 'styled-components'

const menuIn = keyframes`
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

/**
 * Поверхность меню: приподнятая панель с тенью и анимацией появления.
 * Позиционируется компонентом (fixed в корне, absolute в подменю).
 */
export const MenuSurface = styled.div`
  position: fixed;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transform-origin: top left;
  animation: ${menuIn} ${({ theme }) => theme.transitions.fast};
`

export const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
`

export const MenuItemButton = styled.button<{ $danger?: boolean; $active?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 18px 1fr auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 7px ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.text)};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.2;
  text-align: left;
  transition:
    background ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: ${({ theme, $danger }) => ($danger ? theme.colors.dangerSurface : theme.colors.surface)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -2px;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ItemIcon = styled.span<{ $danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: ${({ theme, $danger }) => ($danger ? theme.colors.danger : theme.colors.textMuted)};

  svg {
    width: 16px;
    height: 16px;
  }
`

export const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemHint = styled.span`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const SubmenuChevron = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const MenuSeparator = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  background: ${({ theme }) => theme.colors.border};
`

export const SectionLabel = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`
