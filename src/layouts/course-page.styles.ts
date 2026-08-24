import styled from 'styled-components'

export const Shell = styled.div`
  display: grid;
  min-height: 100vh;
  grid-template-columns: 1fr;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 288px 1fr;
  }
`
export const SidebarSlot = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 20;
  transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
  transition: transform 0.25s ease;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: sticky;
    top: 0;
    height: 100vh;
    transform: none;
  }
`
export const Main = styled.main`
  min-width: 0;
  background: ${({ theme }) => theme.colors.body};
`
export const Overlay = styled.button<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 19;
  border: 0;
  background: ${({ theme }) => theme.colors.overlay};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
export const MobileBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.body}dd;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`
export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  cursor: pointer;
`

// --- Состояния загрузки/ошибки страницы курса ---

export const FullPage = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
`
export const LoadState = styled.div`
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;

  > :first-child {
    margin-bottom: 4px;
  }
`
