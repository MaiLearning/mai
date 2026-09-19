import styled, { css, keyframes } from 'styled-components'

/* ── Анимации ── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const panelIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.975); }
  to   { opacity: 1; transform: translateY(0)     scale(1); }
`

/** Длительность анимации закрытия — совпадает с таймером в компоненте. */
export const CLOSE_DURATION_MS = 180

/* ── Пропсы ── */

export interface ModalStyledProps {
  $closing: boolean
  $width: number
}

/* ── Overlay ── */

export const Overlay = styled.div<ModalStyledProps>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: color-mix(in srgb, ${({ theme }) => theme.background.body} 40%, transparent);
  backdrop-filter: blur(6px) saturate(120%);
  animation: ${fadeIn} 200ms ease both;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${fadeIn} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

/* ── Panel ── */

export const Panel = styled.div<ModalStyledProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $width }) => `${$width}px`};
  max-height: 100dvh;
  background: ${({ theme }) => theme.background.surface};
  border: 1px solid ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.radius.lg} ${({ theme }) => theme.radius.lg} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  animation: ${panelIn} 280ms cubic-bezier(0.32, 0.72, 0, 1) both;

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${panelIn} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    max-height: calc(100dvh - 48px);
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`

/* ── Grabber (моб. bottom sheet) ── */

export const Grabber = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 0;

  &::after {
    content: '';
    width: 42px;
    height: 4px;
    border-radius: ${({ theme }) => theme.radius.full};
    background: ${({ theme }) => theme.border.strong};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`

/* ── Header ── */

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl} 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 28px 0;
  }
`

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  color: ${({ theme }) => theme.text.primary};
`

/* ── Крестик (inline, без IconButton/lucide) ── */

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.text.muted};
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.background.hover};
    color: ${({ theme }) => theme.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.focus.ring};
    outline-offset: 2px;
  }
`

/* ── Body ── */

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  flex: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} 28px;
  }
`

/* ── Footer ── */

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  padding-bottom: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.border.default};
  background: ${({ theme }) => theme.background.surface};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} 28px;
  }
`

export const ModalFooterSpacer = styled.div`
  flex: 1;
`
