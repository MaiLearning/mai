import styled from 'styled-components'

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text.primary};
`

export const LabelText = styled.span`
  color: ${({ theme }) => theme.text.primary};
`

export const Root = styled.input`
  display: block;
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.body};
  color: ${({ theme }) => theme.text.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: 14px;
  transition:
    border-color ${({ theme }) => theme.durations.fast},
    box-shadow ${({ theme }) => theme.durations.fast};

  &:focus {
    border-color: ${({ theme }) => theme.border.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.background.accentSubtle};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.muted};
  }
`

export const Error = styled.span`
  display: block;
  color: ${({ theme }) => theme.status.danger.foreground};
  font-size: 13px;
`
