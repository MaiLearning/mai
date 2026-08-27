import styled from 'styled-components'

export const Shell = styled.div`
  display: grid;
  min-height: 100vh;
  /* Первая колонка — вертикальная панель курса, вторая — контент */
  grid-template-columns: 48px 1fr;
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
/**
 * Вертикальная панель курса для узких экранов: постоянная узкая колонка
 * у левого края с кнопками сверху вниз («Открыть» содержание, «Настройки»).
 * На десктопе (>=lg) не отображается — там сайдбар является постоянной колонкой.
 */
export const Rail = styled.nav`
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 11;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding-top: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: calc(${({ theme }) => theme.breakpoints.lg} - 1px)) {
    display: flex;
  }
`

export const RailButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transitions.fast},
    background ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySurface};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }
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
