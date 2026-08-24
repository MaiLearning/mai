import { X } from 'lucide-react'
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled, { css, keyframes } from 'styled-components'
import { IconButton } from './IconButton'

// ================================================================
//  Анимации
// ================================================================

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`
const panelIn = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.975); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`
/** Длительность анимации закрытия — должна совпадать с таймером в компоненте. */
const CLOSE_DURATION_MS = 180

// ================================================================
//  Стилизованные части
// ================================================================

const Overlay = styled.div<{ $closing: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(6px) saturate(120%);
  animation: ${fadeIn} 200ms ease both;
  overflow-y: auto;
  overscroll-behavior: contain;

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${fadeIn} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}

  @media (min-width: 768px) {
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`
const Panel = styled.div<{ $closing: boolean; $width: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $width }) => `${$width}px`};
  max-height: 100dvh;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl} ${({ theme }) => theme.radii.xl} 0 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
  animation: ${panelIn} 280ms cubic-bezier(0.32, 0.72, 0, 1) both;

  ${({ $closing }) =>
    $closing &&
    css`
      animation: ${panelIn} ${CLOSE_DURATION_MS}ms ease reverse both;
    `}

  @media (min-width: 768px) {
    max-height: calc(100dvh - 48px);
    border-radius: ${({ theme }) => theme.radii.xl};
  }
`
/** Хваталка для bottom sheet на мобильных — на десктопе скрыта. */
const Grabber = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0 0;

  &::after {
    content: '';
    width: 42px;
    height: 4px;
    border-radius: ${({ theme }) => theme.radii.pill};
    background: ${({ theme }) => theme.colors.borderStrong};
  }

  @media (min-width: 768px) {
    display: none;
  }
`

/** Прокручиваемое тело модалки (класс .app-scroll стилизуется в global-style). */
export const ModalBody = styled.div.attrs({ className: 'app-scroll' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  flex: 1;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} 28px;
  }
`

export const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  padding-bottom: max(${({ theme }) => theme.spacing.lg}, env(safe-area-inset-bottom));
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} 28px;
  }
`

export const ModalFooterSpacer = styled.div`
  flex: 1;
`

// ================================================================
//  Встроенный хедер (для варианта с пропом title)
// ================================================================

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl} 0;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl} 28px 0;
  }
`
const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.3;
`
const CloseGlyph = styled(X)`
  width: 18px;
  height: 18px;
`

// ================================================================
//  Компонент
// ================================================================

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ModalProps {
  /** Открыта ли модалка. */
  opened: boolean
  /** Колбэк закрытия (Esc, клик по фону, крестик). */
  onClose: () => void
  /** Заголовок. Если задан — модалка рисует хедер с крестиком и сама прокручивает
   * содержимое. Если не задан — потребитель компонует хедер и ModalBody/ModalFooter сам. */
  title?: string
  /** id элемента заголовка для aria-labelledby в композиционном режиме (без title). */
  labelledBy?: string
  /**
   * Разрешено ли закрывать окно вне программного сценария (Esc, фон, крестик).
   * Используется во время сабмита, чтобы заблокировать случайное закрытие.
   */
  dismissible?: boolean
  /** Максимальная ширина панели в px. */
  width?: number
  /**
   * Футер с кнопками действий. Рендерится вне прокручиваемой области,
   * под телом модалки (только вместе с title).
   */
  footer?: ReactNode
  children: ReactNode
}

/**
 * Модальное окно: портал в body, размытие фона, анимации открытия/закрытия,
 * bottom sheet на мобильных, focus trap и возврат фокуса на триггер.
 */
export function Modal({
  opened,
  onClose,
  title,
  labelledBy,
  dismissible = true,
  width = 620,
  footer,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const fallbackId = useId()
  const titleId = useId()

  useEffect(() => setMounted(true), [])

  // Появление с анимацией и отложенный unmount после анимации закрытия
  useEffect(() => {
    if (opened) {
      // Захватываем триггер только при реальном открытии: повторный запуск эффекта
      // после setVisible() видел бы уже сфокусированный элемент внутри модалки.
      if (!visible) restoreFocus.current = document.activeElement as HTMLElement
      setVisible(true)
      setClosing(false)
      return
    }
    if (!visible) return
    setClosing(true)
    const timer = window.setTimeout(() => {
      setVisible(false)
      setClosing(false)
      restoreFocus.current?.focus?.()
    }, CLOSE_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [opened, visible])

  // Блокировка прокрутки страницы под модалкой
  useEffect(() => {
    if (!visible) return
    document.body.dataset.scrollLocked = 'true'
    return () => {
      delete document.body.dataset.scrollLocked
    }
  }, [visible])

  // Автофокус на первом интерактивном элементе панели
  useEffect(() => {
    if (!opened || !visible) return
    const frame = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(first ?? panelRef.current)?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [opened, visible])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        if (dismissible) onClose()
        return
      }
      if (event.key !== 'Tab') return

      const nodes = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [dismissible, onClose],
  )

  if (!mounted || !visible) return null

  const labelledById = title ? titleId : (labelledBy ?? fallbackId)

  return createPortal(
    <Overlay
      $closing={closing}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissible) onClose()
      }}
    >
      <Panel
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        tabIndex={-1}
        $closing={closing}
        $width={width}
        onKeyDown={onKeyDown}
      >
        <Grabber aria-hidden="true" />
        {title ? (
          <>
            <Header>
              <Title id={titleId}>{title}</Title>
              {dismissible && (
                <IconButton label="Закрыть" onClick={onClose}>
                  <CloseGlyph>×</CloseGlyph>
                </IconButton>
              )}
            </Header>
            <ModalBody>{children}</ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        ) : (
          children
        )}
      </Panel>
    </Overlay>,
    document.body,
  )
}
