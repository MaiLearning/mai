import styled from 'styled-components'

export const PickerRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

export const KindTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`

export const KindTab = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.utils.getBorder('accent', 'default') : theme.utils.getBorder('neutral', 'default'))};
  background: ${({ theme, $active }) => ($active ? theme.utils.getBackground('accent', 'surface') : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted'))};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast};

  &:hover {
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  }
`

export const PickerField = styled.div`
  display: flex;
  flex-direction: column;
`

export const PickerSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
    outline: none;
  }
`
