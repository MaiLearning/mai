import { Button } from '@mai/theme'
import styled from 'styled-components'

export const Bar = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const IconSlot = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`

/** Действие панели: тема `Button`, приведённая к компактной пилюле сайдбара. */
export const ActionButton = styled(Button)`
  gap: 6px;
  padding: 6px 12px 6px 9px;
  min-height: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12.5px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: -0.01em;
  white-space: nowrap;
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
  background: ${({ $open, theme }) =>
    $open ? theme.utils.getBackground('neutral', 'elevated') : 'transparent'};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  transition: background ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  min-width: 190px;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
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
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 13px;
  font-weight: 500;
  text-align: left;

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'elevated'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`
