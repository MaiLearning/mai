import styled from 'styled-components'

export const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 480px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const FieldLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`

export const PathRow = styled.div`
  display: flex;
  gap: 8px;
`

export const PathInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const ProbeButton = styled.button`
  height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.8125rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export const Hint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`
