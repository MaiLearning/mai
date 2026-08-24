import styled from 'styled-components'
import { Brand, Mark } from './HomeHeader.styles'

export const FooterRoot = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`
export const FooterInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 28px 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    padding-right: 32px;
    padding-left: 32px;
  }
`

export { Brand, Mark }
