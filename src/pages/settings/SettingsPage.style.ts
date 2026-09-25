import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'body')};
`

export const Inner = styled.div`
  width: 100%;
  max-width: 1120px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.md} ${theme.spacing.xl}`};
  @media (min-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xl}`};
  }
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
`

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`

export const CloseLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  text-decoration: none;
  transition:
    color ${({ theme }) => theme.durations.fast},
    background ${({ theme }) => theme.durations.fast},
    transform ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`
