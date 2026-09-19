import styled from 'styled-components'

/** Каркас главной: сайдбар слева (только lg+), контент по центру, мобильная навигация снизу. */
export const ShellRoot = styled.div`
  min-height: 100vh;
  padding-bottom: 76px;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-bottom: 0;
  }
`

export const ShellInner = styled.div`
  display: flex;
  width: 100%;
`

export const Sidebar = styled.aside`
  display: none;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  width: 256px;
  padding: 24px 20px;
  border-right: 1px solid ${({ theme }) => theme.border.default};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.text.primary};
`

export const BrandMark = styled.span`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.background.accent};
  color: ${({ theme }) => theme.text.onPrimary};
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
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.muted)};
  background: ${({ theme, $active }) => ($active ? theme.background.selected : 'transparent')};
  transition: background ${({ theme }) => theme.durations.fast};
  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.background.selected : theme.background.hover)};
    color: ${({ theme }) => theme.text.primary};
  }
`

export const Content = styled.section`
  min-width: 0;
  flex: 1;
`

/** Центрирующая оболочка: контент всегда по центру с полями слева/справа. */
export const ContentInner = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 64px;
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 24px 32px 64px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 32px 48px 64px;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => theme.border.default};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
  }
`

export const HeaderText = styled.div`
  min-width: 0;
`

export const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${({ theme }) => theme.text.muted};
  svg {
    color: ${({ theme }) => theme.text.accent};
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

export const Greeting = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text.primary};
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 30px;
  }
`

export const GreetingSub = styled.p`
  margin: 4px 0 0;
  font-size: 14px;
  color: ${({ theme }) => theme.text.muted};
`

export const HeaderActions = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const IconButton = styled.button`
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};
  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

export const Avatar = styled.div`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(135deg, #a78bfa, #4f46e5);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
`

export const MobileNav = styled.nav`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.popover};
  padding: 8px 12px max(12px, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.elevated};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`

export const MobileNavGrid = styled.div`
  margin: 0 auto;
  display: grid;
  max-width: 28rem;
  grid-template-columns: repeat(3, 1fr);
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
  font-weight: 500;
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.muted)};
  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }
`
