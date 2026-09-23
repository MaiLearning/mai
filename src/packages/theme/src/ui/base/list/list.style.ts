import styled from 'styled-components'
import type { AppTheme } from '../../../base/theme'
import type { ListDirection, ListGap } from './list'

export interface ListRootProps {
  $direction: ListDirection
  $gap: ListGap
}

function resolveGap(gap: ListGap, spacing: AppTheme['spacing']) {
  if (gap === 'none') return '0'

  return gap in spacing ? spacing[gap as keyof typeof spacing] : gap
}

export const ListRoot = styled.div<ListRootProps>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'horizontal' ? 'row' : 'column')};
  gap: ${({ theme, $gap }) => resolveGap($gap, theme.spacing)};
  outline: none;
`

export interface ListItemRootProps {
  $selected: boolean
  $focused: boolean
  $active: boolean
  $disabled: boolean
}

export const ListItemRoot = styled.div<ListItemRootProps>`
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  user-select: none;
  transition:
    background-color ${({ theme }) => theme.durations.fast} ease,
    border-color ${({ theme }) => theme.durations.fast} ease;

  &:hover {
    background: ${({ theme, $disabled }) =>
      $disabled
        ? 'transparent'
        : theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
  }

  ${({ theme, $selected }) =>
    $selected &&
    `
      background: ${theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')};
      border-color: ${theme.utils.getBorder('accent', 'default')};
      color: ${theme.utils.getText('accent', 'primary')};
    `}

  ${({ theme, $focused }) =>
    $focused &&
    `
      outline: 2px solid ${theme.utils.getFocusRing()};
      outline-offset: -2px;
    `}

  ${({ theme, $active }) =>
    $active &&
    `
      background: ${theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'activeAlpha')};
    `}

  ${({ theme, $disabled }) =>
    $disabled &&
    `
      color: ${theme.utils.getText('neutral', 'muted')};
      cursor: not-allowed;
      opacity: 0.6;
    `}
`
