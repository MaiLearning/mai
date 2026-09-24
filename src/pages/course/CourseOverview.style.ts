import styled from 'styled-components'

export const Overview = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 96px;
  @container course-main (min-width: 768px) {
    padding: 52px 40px 120px;
  }
`
export const Kicker = styled.span`
  display: inline-block;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.utils.getText('accent', 'primary')};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
`
export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  font-size: clamp(1.8rem, 4vw, 2.7rem);
  text-wrap: balance;
`
export const Lead = styled.p`
  margin: 14px 0 28px;
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  text-wrap: pretty;
`
