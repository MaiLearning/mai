import styled from 'styled-components'
import { MainContainer } from './shared.styles'

export const Steps = styled(MainContainer)`
  display: grid;
  gap: 16px;
  padding-bottom: 8px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`
export const Step = styled.div`
  padding: 24px;
  display: grid;
  gap: 10px;
  align-content: start;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 17px;
  }
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14.5px;
  }
`
export const StepIcon = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
`
