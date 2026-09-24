import styled from 'styled-components'

export const Shell = styled.div<{ $focused: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 46px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  border: 1px solid
    ${({ theme, $focused }) =>
      $focused
        ? theme.utils.getBorder('accent', 'default')
        : theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme, $focused }) =>
    $focused ? `0 0 0 3px ${theme.utils.getBackground('accent', 'surface')}` : 'none'};
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};
  cursor: text;
`

export const BareInput = styled.input`
  flex: 1;
  min-width: 120px;
  height: 32px;
  padding: 0 4px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14.5px;

  &::placeholder {
    color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  }

  /* Индикатор фокуса один — на Shell; гасим глобальное :focus-visible,
     иначе обводка рисуется вокруг внутреннего инпута и «урезает» поле */
  &:focus,
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`

export const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.md};
`

export const Suggestion = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 10px 0 8px;
  border: 1px dashed ${({ theme }) => theme.utils.getBorder('neutral', 'strong')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    border-style: solid;
    background: ${({ theme }) => theme.utils.getBackground('accent', 'surface')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`
