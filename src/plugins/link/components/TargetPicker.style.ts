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
  border-radius: ${({ theme }) => theme.radii.pill};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primarySurface : theme.colors.surface};
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textMuted)};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const PickerField = styled.div`
  display: flex;
  flex-direction: column;
`

export const PickerSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
