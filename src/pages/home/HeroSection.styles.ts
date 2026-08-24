import styled from 'styled-components'
import { MainContainer } from './shared.styles'

export const Hero = styled(MainContainer)`
  display: grid;
  gap: 40px;
  padding-top: 56px;
  padding-bottom: 40px;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    padding-top: 88px;
    padding-bottom: 64px;
  }
`
export const HeroTitle = styled.h1`
  margin-top: 22px;
  max-width: 700px;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 700;
  text-wrap: balance;
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`
export const HeroText = styled.p`
  max-width: 48ch;
  margin: 18px 0 30px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 18px;
  text-wrap: pretty;
`
export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`
export const ContinueCard = styled.div`
  padding: 24px;
  display: grid;
  gap: 18px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`
export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`
export const Thumb = styled.div<{ $from?: string; $to?: string }>`
  height: 132px;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  color: white;
`
export const CourseName = styled.h3`
  font-size: 20px;
`
export const Meta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`
export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  font-weight: 600;
`
