import styled from 'styled-components'

export const CheckboxRoot = styled.button<{ $checked: boolean }>`
  position: relative;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  border: 1px solid
    ${({ theme, $checked }) =>
      $checked
        ? theme.utils.getSolid('accent', 'base')
        : theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};

  cursor: pointer;
  color: ${({ theme }) => theme.contrastText.accent};
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
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
    cursor: not-allowed;
  }
`

export const Indicator = styled.span<{ $checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;

  svg {
    width: 100%;
    height: 100%;
  }
`
