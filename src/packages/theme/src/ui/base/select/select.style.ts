import styled, { keyframes } from 'styled-components'

const panelIn = keyframes`
  from { opacity: 0; transform: translateY(-4px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  width: 100%;
`

export const SelectTrigger = styled.button<{ $opened: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  min-height: 36px;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  text-align: left;

  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  border: 1px solid
    ${({ theme, $opened }) =>
      $opened
        ? theme.utils.getBorder('accent', 'default')
        : theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};

  cursor: pointer;
  user-select: none;

  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background-color ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'hoverAlpha')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 1px;
  }

  &:disabled {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
  }
`

export const SelectOptionText = styled.span<{ $placeholder?: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme, $placeholder }) =>
    $placeholder ? theme.utils.getText('neutral', 'muted') : 'inherit'};
`

export const SelectChevron = styled.span<{ $opened: boolean }>`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  transform: rotate(${({ $opened }) => ($opened ? '180deg' : '0deg')});
  transition: transform ${({ theme }) => theme.durations.fast};

  svg {
    width: 16px;
    height: 16px;
  }
`

/** Панель списка: приподнятая поверхность с анимацией появления. */
export const SelectPanel = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.popover};
  min-width: 220px;
  max-width: min(320px, calc(100vw - 16px));
  max-height: 260px;
  overflow: auto;

  padding: ${({ theme }) => theme.spacing.xs};
  box-sizing: border-box;

  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transform-origin: top left;
  animation: ${panelIn} ${({ theme }) => theme.durations.fast};

  &:focus {
    outline: none;
  }
`

export const SelectOptionButton = styled.button<{ $selected: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px ${({ theme }) => theme.spacing.sm};
  box-sizing: border-box;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  line-height: 1.2;
  text-align: left;
  color: ${({ theme, $selected }) =>
    $selected
      ? theme.utils.getText('accent', 'primary')
      : theme.utils.getText('neutral', 'primary')};

  background: ${({ theme, $active, $selected }) =>
    $active
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'elevated'), 'hoverAlpha')
      : $selected
        ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
        : 'transparent'};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.utils.getBorder('accent', 'default') : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;

  transition:
    background-color ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'elevated'), 'hoverAlpha')};
  }
`
