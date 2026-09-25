import styled from 'styled-components'

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`

export const Status = styled.div`
  min-height: 20px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
`
