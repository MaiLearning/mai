import styled from 'styled-components'

/** Якорь поповера: относительно него позиционируется панель. */
export const Anchor = styled.div`
  position: relative;
  display: inline-flex;
`

/** Панель меню под якорем. */
export const Panel = styled.div<{ $align: 'start' | 'end' }>`
  position: absolute;
  top: calc(100% + 8px);
  ${({ $align }) => ($align === 'end' ? 'right: 0' : 'left: 0')};
  z-index: 20;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

/** Строка-кнопка меню (пресеты сложности, типы задач). */
export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
`

/** Разделитель секций меню. */
export const MenuDivider = styled.div`
  height: 1px;
  margin: 4px 6px;
  background: ${({ theme }) => theme.colors.border};
`

/** Цветная точка слева от названия сложности. */
export const ColorDot = styled.span<{ $bg: string }>`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 999px;
  background: ${({ $bg }) => $bg};
  box-shadow: inset 0 0 0 1px rgba(22, 20, 40, 0.15);
`
