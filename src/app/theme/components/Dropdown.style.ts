import styled from 'styled-components'

export const MENU_MAX_HEIGHT = 280
export const MENU_GAP = 4
export const MENU_Z_INDEX = 1001

/** Позиция меню: обычно под триггером, при нехватке места снизу — над ним. */
export interface MenuPosition {
  left: number
  minWidth: number
  top?: number
  bottom?: number
}

export const Root = styled.div`
  display: inline-flex;
`

export const Trigger = styled.button<{ $opened: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 160px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySurface};
    outline: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  & > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    transform: ${({ $opened }) => ($opened ? 'rotate(180deg)' : 'none')};
    transition: transform ${({ theme }) => theme.transitions.fast};
  }
`

export const TriggerLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Menu = styled.ul<{ $position: MenuPosition }>`
  position: fixed;
  left: ${({ $position }) => $position.left}px;
  top: ${({ $position }) => ($position.top !== undefined ? `${$position.top}px` : 'auto')};
  bottom: ${({ $position }) => ($position.bottom !== undefined ? `${$position.bottom}px` : 'auto')};
  min-width: ${({ $position }) => $position.minWidth}px;
  max-height: ${MENU_MAX_HEIGHT}px;
  margin: 0;
  padding: 4px;
  list-style: none;
  overflow-y: auto;
  z-index: ${MENU_Z_INDEX};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const Option = styled.li<{ $active: boolean; $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.primarySurface : 'transparent')};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.text)};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  cursor: pointer;
  user-select: none;
`

export const Empty = styled.li`
  padding: 8px 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
`
