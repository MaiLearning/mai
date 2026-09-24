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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const TextInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  }
`

export const TextArea = styled.textarea`
  min-height: 72px;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-family: ${({ theme }) => theme.typography.fontFamilyMonospace};
  font-size: 0.8125rem;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.utils.getBorder('accent', 'default')};
  }
`

export const Hint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`
