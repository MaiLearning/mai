import styled, { css, keyframes } from 'styled-components'
import { CLOSE_DURATION_MS, fadeIn } from '../overlay/overlay.style'

/* ── Анимации выезда панели ── */

const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
`
const slideInLeft = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
`
const slideInBottom = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`

const slideBySide = {
  right: slideInRight,
  left: slideInLeft,
  bottom: slideInBottom,
} as const

export type DrawerSide = keyof typeof slideBySide
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full'

const SIZES: Record<Exclude<DrawerSize, 'full'>, number> = {
  sm: 320,
  md: 420,
  lg: 560,
}

/** Ширина (right/left) или высота (bottom) панели по размеру. */
function sizeValue(size: DrawerSize): string {
  if (size === 'full') return '100%'

  return `${SIZES[size]}px`
}

export interface DrawerStyledProps {
  $side: DrawerSide
  $size: DrawerSize
  $closing: boolean
}

/** Подложка шторки: прижимает панель к выбранной стороне. */
export const Overlay = styled.div<Pick<DrawerStyledProps, '$side' | '$closing'>>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  background: ${({ theme }) =>
    theme.utils.withState(theme.utils.getBackground('neutral', 'body'), 'disabledAlpha')};
  backdrop-filter: blur(6px) saturate(120%);
  animation: ${fadeIn} 200ms ease both;
  overscroll-behavior: contain;

  ${({ $side }) =>
    $side === 'right' &&
    css`
      justify-content: flex-end;
      align-items: stretch;
    `}

  ${({ $side }) =>
    $side === 'left' &&
    css`
      justify-content: flex-start;
      align-items: stretch;
    `}

  ${({ $side }) =>
    $side === 'bottom' &&
    css`
      justify-content: center;
      align-items: flex-end;
    `}

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${fadeIn} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}
`

/** Панель шторки. */
export const Panel = styled.div<DrawerStyledProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'surface')};
  border: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  animation: ${({ $side }) => slideBySide[$side]} 280ms cubic-bezier(0.32, 0.72, 0, 1) both;

  ${({ $side, $size, theme }) =>
    $side === 'right' &&
    css`
      width: ${sizeValue($size)};
      max-width: 100vw;
      height: 100%;
      border-radius: ${theme.radius.lg} 0 0 ${theme.radius.lg};
      border-right: 0;
    `}

  ${({ $side, $size, theme }) =>
    $side === 'left' &&
    css`
      width: ${sizeValue($size)};
      max-width: 100vw;
      height: 100%;
      border-radius: 0 ${theme.radius.lg} ${theme.radius.lg} 0;
      border-left: 0;
    `}

  ${({ $side, $size, theme }) =>
    $side === 'bottom' &&
    css`
      width: 100%;
      max-height: ${$size === 'full' ? '100dvh' : sizeValue($size)};
      border-radius: ${theme.radius.lg} ${theme.radius.lg} 0 0;
      border-bottom: 0;
    `}

  ${({ $closing, $side }) =>
    $closing &&
    css`
      animation: ${slideBySide[$side]} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}
`

/** Шапка шторки: заголовок и кнопка закрытия. */
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl} 0;
  flex: 0 0 auto;
`

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.semibold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
`

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
  color: ${({ theme }) => theme.utils.getText('neutral', 'muted')};
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background ${({ theme }) => theme.durations.fast},
    color ${({ theme }) => theme.durations.fast};

  &:hover {
    background: ${({ theme }) =>
      theme.utils.withState(theme.utils.getBackground('neutral', 'surface'), 'hoverAlpha')};
    color: ${({ theme }) => theme.utils.getText('neutral', 'primary')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.utils.getFocusRing()};
    outline-offset: 2px;
  }
`

/** Тело шторки — прокручиваемая область. */
export const DrawerBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
`

/** Футер шторки. */
export const DrawerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  padding-bottom: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.utils.getBorder('neutral', 'default')};
  background: ${({ theme }) => theme.utils.getBackground('neutral', 'raised')};
  flex: 0 0 auto;
`

export const DrawerFooterSpacer = styled.div`
  flex: 1;
`
