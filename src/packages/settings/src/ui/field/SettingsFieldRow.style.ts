import styled from 'styled-components'

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

export const Label = styled.label`
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`
