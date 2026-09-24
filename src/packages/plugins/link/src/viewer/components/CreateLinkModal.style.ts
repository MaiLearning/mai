import styled from 'styled-components'

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const FieldsLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
`

export const FieldsSelect = styled.select`
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
