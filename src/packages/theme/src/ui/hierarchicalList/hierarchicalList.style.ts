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
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.background.raised};
  color: ${({ theme }) => theme.text.muted};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.durations.fast} ease,
    border-color ${({ theme }) => theme.durations.fast} ease,
    color ${({ theme }) => theme.durations.fast} ease;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    border-color: ${({ theme }) => theme.border.strong};
    color: ${({ theme }) => theme.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 1px;
  }

  &:active {
    background: ${({ theme }) => theme.background.active};
  }

  &:disabled {
    background: ${({ theme }) => theme.background.disabled};
    border-color: ${({ theme }) => theme.border.default};
    color: ${({ theme }) => theme.text.muted};
    cursor: not-allowed;
  }
`

export const ToggleChevron = styled.span<{ $expanded: boolean }>`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-right: 1px solid ${({ theme }) => theme.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.text.primary};
  transform: rotate(${({ $expanded }) => ($expanded ? '45deg' : '-45deg')});
  transition: transform ${({ theme }) => theme.durations.fast} ease;
`
