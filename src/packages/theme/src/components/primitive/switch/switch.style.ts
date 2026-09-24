import styled from 'styled-components'

/** Контейнер-переключатель: трек + бегунок. */
export const SwitchRoot = styled.button<{ $checked: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: 40px;
  height: 22px;
  padding: 0;
  flex: 0 0 auto;

  background: ${({ theme, $checked }) =>
    $checked
      ? theme.utils.getSolid('accent', 'base')
      : theme.utils.getBackground('neutral', 'raised')};
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked
        ? theme.utils.getSolid('accent', 'base')
        : theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.full};

  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'raised'), 'disabledAlpha')};
    border-color: ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
    cursor: not-allowed;
  }
`

/** Бегунок-ручка. */
export const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? '20px' : '2px')};
  width: 16px;
  height: 16px;

  background: ${({ theme, $checked }) =>
    $checked ? theme.contrastText.accent : theme.utils.getText('neutral', 'primary')};
  border-radius: ${({ theme }) => theme.radius.full};

  transition: left ${({ theme }) => theme.durations.fast} ease;
`
