import styled from 'styled-components'

export const Shell = styled.div<{ $focused: boolean }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-height: 46px;
  padding: 6px 8px;
  background: ${({ theme }) => theme.background.body};
  border: 1px solid
    ${({ theme, $focused }) => ($focused ? theme.border.accent : theme.border.default)};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme, $focused }) =>
    $focused ? `0 0 0 3px ${theme.background.accentSubtle}` : 'none'};
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};
  cursor: text;
`

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 30px;
  padding: 0 6px 0 11px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.background.accentSubtle};
  color: ${({ theme }) => theme.text.accent};
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`

export const TagRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  opacity: 0.65;
  transition:
    opacity ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast};

  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.background.hover};
  }
`

export const BareInput = styled.input`
  flex: 1;
  min-width: 120px;
  height: 32px;
  padding: 0 4px;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14.5px;

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
    opacity: 0.75;
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
  border: 1px dashed ${({ theme }) => theme.border.strong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.durations.fast},
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.text.accent};
    border-color: ${({ theme }) => theme.border.accent};
    border-style: solid;
    background: ${({ theme }) => theme.background.accentSubtle};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`
