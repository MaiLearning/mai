import styled from 'styled-components'

/** Плавающая панель меню автокомплита (fixed — координаты вьюпорта). */
export const MenuSurface = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  z-index: 1000;
  top: ${({ $y }) => $y}px;
  left: ${({ $x }) => $x}px;
  min-width: 220px;
  max-width: 340px;
  max-height: 260px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.elevated};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &[data-active='true'] {
    background: ${({ theme }) => theme.background.accentSubtle};
    color: ${({ theme }) => theme.text.accent};
  }
`

export const MenuEmpty = styled.div`
  padding: 10px;
  color: ${({ theme }) => theme.text.muted};
  font-size: 13px;
`
