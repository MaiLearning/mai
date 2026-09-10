import styled from 'styled-components'

export const Root = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FieldLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`

export const TextInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const TextArea = styled.textarea`
  min-height: 72px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

export const Hint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`
