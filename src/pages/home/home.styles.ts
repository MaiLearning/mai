import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ActionLink = styled(Link)<{
  $variant?: 'primary' | 'ghost' | 'soft'
  $size?: 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-weight: 600;
  white-space: nowrap;
  font-size: ${({ $size }) => ($size === 'lg' ? '16px' : '14px')};
  padding: ${({ $size }) => ($size === 'lg' ? '14px 26px' : '10px 18px')};
  transition:
    transform 0.12s ease,
    background 0.16s ease,
    box-shadow 0.16s ease;
  background: ${({ theme, $variant }) => ($variant === 'ghost' ? 'transparent' : $variant === 'soft' ? theme.colors.primarySurface : theme.colors.primary)};
  color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.text : $variant === 'soft' ? theme.colors.primary : theme.colors.textOnPrimary)};
  border-color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.border : 'transparent')};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    background: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.surface : $variant === 'soft' ? theme.colors.primarySurface : theme.colors.primaryHover)};
  }
  &:active {
    transform: translateY(1px);
  }
`

export const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 32px;
  }
`
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
export const Thumb = styled.div`
  height: 132px;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, #6a54ff, #9d7bff);
  color: white;
`
export const CourseName = styled.h3`
  font-size: 20px;
`
export const Meta = styled.div`
  display: flex;
  align-items: center;
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
export const CoursesSection = styled(MainContainer)`
  padding: 48px 20px 72px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 64px 32px 96px;
  }
`
export const SectionHead = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  h2 {
    font-size: clamp(1.6rem, 4vw, 2.2rem);
  }
  p {
    margin: 8px 0 0;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`
export const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`
export const CourseCard = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`
export const CardArt = styled.div<{
  $from: string
  $to: string
}>`
  height: 110px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, ${({ $from }) => $from}, ${({ $to }) => $to});
  color: white;
`
export const CardBody = styled.div`
  display: grid;
  flex: 1;
  gap: 10px;
  padding: 20px;
  h3 {
    font-size: 17px;
  }
`
export const CardMeta = styled.div`
  display: flex;
  gap: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`
export const CardFoot = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 600;
  .row {
    display: flex;
    justify-content: space-between;
  }
`
export const CreateCard = styled(Link)`
  min-height: 220px;
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 32px;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  transition:
    border-color 0.16s ease,
    color 0.16s ease,
    background 0.16s ease;
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
  }
  span {
    max-width: 28ch;
    font-size: 13.5px;
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface}55;
  }
`
export const CreateIcon = styled.span`
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primarySurface};
  color: ${({ theme }) => theme.colors.primary};
`
