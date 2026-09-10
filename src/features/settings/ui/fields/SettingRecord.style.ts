import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-radius: ${({ theme }) => theme.radii.md};
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`

export const Name = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

export const Description = styled.span`
  font-family: ${({ theme }) => theme.font.body};
  font-size: 13px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
`
