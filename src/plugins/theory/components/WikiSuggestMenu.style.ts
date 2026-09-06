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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

export const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.accentSurface};
    color: ${({ theme }) => theme.colors.accent};
  }
`

export const MenuEmpty = styled.div`
  padding: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`
