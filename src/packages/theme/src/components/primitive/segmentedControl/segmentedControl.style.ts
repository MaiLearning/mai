import styled from 'styled-components'

export const SegmentedRoot = styled.div<{ $disabled?: boolean }>`
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;

  padding: 3px;
  gap: 2px;

  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};

  opacity: ${({ $disabled }) => ($disabled ? 1 : undefined)};
`

export const SegmentedItem = styled.button<{ $selected: boolean }>`
  min-height: 28px;
  padding: 4px 14px;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  color: ${({ theme, $selected }) =>
    $selected
      ? theme.utils.getText('accent', 'primary')
      : theme.utils.getText('neutral', 'primary')};

  background: ${({ theme, $selected }) =>
    $selected
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
      : 'transparent'};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.utils.getBorder('accent', 'default') : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;
  user-select: none;

  transition:
    background-color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme, $selected }) =>
      $selected
        ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
        : theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'hoverAlpha')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: -2px;
  }

  &:disabled {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
    background: transparent;
  }
`
