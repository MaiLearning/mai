import { themedScrollbar } from '@mai/theme'
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
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${themedScrollbar}
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 13px;
  text-align: left;
  cursor: pointer;

  &[data-active='true'] {
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  }
`

export const MenuEmpty = styled.div`
  padding: 10px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: 13px;
`
