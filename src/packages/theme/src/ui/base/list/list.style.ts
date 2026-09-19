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
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  cursor: pointer;
  user-select: none;
  transition:
    background-color ${({ theme }) => theme.durations.fast} ease,
    border-color ${({ theme }) => theme.durations.fast} ease;

  &:hover {
    background: ${({ theme, $disabled }) => ($disabled ? 'transparent' : theme.background.hover)};
  }

  ${({ theme, $selected }) =>
    $selected &&
    `
      background: ${theme.background.selected};
      border-color: ${theme.border.accent};
      color: ${theme.text.accent};
    `}

  ${({ theme, $focused }) =>
    $focused &&
    `
      outline: 2px solid ${theme.focus.ring};
      outline-offset: -2px;
    `}

  ${({ theme, $active }) =>
    $active &&
    `
      background: ${theme.background.active};
    `}

  ${({ theme, $disabled }) =>
    $disabled &&
    `
      color: ${theme.text.muted};
      cursor: not-allowed;
      opacity: 0.6;
    `}
`
