import styled from 'styled-components'
import { Text } from '@/app/theme/components'

export const Overview = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 96px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 52px 40px 120px;
  }
`
export const Kicker = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
`
export const Title = styled.h1`
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  text-wrap: balance;
`
export const Lead = styled.p`
  margin: 14px 0 28px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 18px;
  text-wrap: pretty;
`
export const Hint = styled(Text)`
  display: block;
  padding: 16px 18px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
`
