import styled from 'styled-components'

export const HierarchicalListItem = styled.div<{ $depth: number }>`
  margin-left: ${({ $depth, theme }) => `calc(${theme.spacing.md} * ${$depth})`};
  width: ${({ $depth, theme }) => `calc(100% - ${theme.spacing.md} * ${$depth})`};
`

export const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  margin: 0 ${({ theme }) => theme.spacing.xs} 0 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.durations.fast} ease,
    border-color ${({ theme }) => theme.durations.fast} ease,
    color ${({ theme }) => theme.durations.fast} ease;

  &:hover {
    background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'hoverAlpha')};
    border-color: ${({ theme }) => theme.utils.withState(theme.utils.getBorder('neutral', 'default'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
  }

  &:active {
    background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'activeAlpha')};
  }

  &:disabled {
    background: ${({ theme }) => theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
  }
`

export const ToggleChevron = styled.span<{ $expanded: boolean }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-right: 1px solid ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  border-bottom: 1px solid ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  transform: rotate(${({ $expanded }) => ($expanded ? '45deg' : '-45deg')});
  transition: transform ${({ theme }) => theme.durations.fast} ease;
`
