import { Link } from 'react-router-dom'
import styled from 'styled-components'

export { ActionLink } from './shared.styles'

export const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 2;
  background: color-mix(in srgb, ${({ theme }) => theme.colors.body} 82%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
export const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 68px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 32px;
  }
`
export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.font.display};
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
`
export const Mark = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}66;
`
export const NavLinks = styled.nav`
  display: none;
  align-items: center;
  gap: 28px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  a:hover {
    color: ${({ theme }) => theme.colors.text};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`
