import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Sidebar = styled.aside`
  display: none;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  width: 256px;
  padding: 24px 20px;
  border-right: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  @container home-shell (min-width: 1200px) {
    display: block;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.utils.getSolid('accent', 'base')};
  color: ${({ theme }) => theme.contrastText.accent};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

export const Nav = styled.nav`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`

export const NavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.semibold : theme.typography.weights.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  background: ${({ theme, $active }) =>
    $active
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
      : 'transparent'};
  transition: background ${({ theme }) => theme.durations.fast};
  &:hover {
    background: ${({ theme, $active }) =>
      theme.utils.withState(
        theme.utils.getBackground('neutral', 'surface'),
        $active ? 'selectedAlpha' : 'hoverAlpha',
      )};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const RouteNavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-weight: ${({ $active, theme }) =>
    $active ? theme.typography.weights.semibold : theme.typography.weights.regular};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  background: ${({ theme, $active }) =>
    $active
      ? theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'selectedAlpha')
      : 'transparent'};
  transition: background ${({ theme }) => theme.durations.fast};
  &:hover:not(:disabled) {
    background: ${({ theme, $active }) =>
      theme.utils.withState(
        theme.utils.getBackground('neutral', 'surface'),
        $active ? 'selectedAlpha' : 'hoverAlpha',
      )};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const MobileNav = styled.nav`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  padding: 8px 12px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'elevated')};
  @container home-shell (min-width: 1200px) {
    display: none;
  }
`

export const MobileNavGrid = styled.div`
  margin: 0 auto;
  display: grid;
  max-width: 28rem;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
`

export const MobileNavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`

export const RouteMobileLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  text-decoration: none;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.utils.getText('neutral', 'primary') : theme.utils.getText('neutral', 'muted')};
  &:hover:not(:disabled) {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }
`
