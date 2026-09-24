import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CLOSE_DURATION_MS,
  CloseButton,
  Grabber,
  Header,
  ModalBody,
  ModalFooter,
  Overlay,
  Panel,
  Title,
} from './modal.style'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface ModalProps {
  opened: boolean
  onClose: () => void
  title?: string
  labelledBy?: string
  dismissible?: boolean
  width?: number
  footer?: ReactNode
  children: ReactNode
}

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
  const savedScrollY = useRef(0)
  const fallbackId = useId()
  const titleId = useId()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (opened) {
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
      restoreFocus.current?.focus?.({ preventScroll: true })
    }, CLOSE_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [opened, visible])

  useEffect(() => {
    if (!visible) return
    savedScrollY.current = window.scrollY
    document.body.style.overflow = 'hidden'

    return () => {
      const y = savedScrollY.current
      document.body.style.overflow = ''
      window.scrollTo(0, y)
      requestAnimationFrame(() => {
        if (window.scrollY !== y) window.scrollTo(0, y)
      })
    }
  }, [visible])

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
      $width={width}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissible) onClose()
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
                <CloseButton aria-label="Закрыть" onClick={onClose}>
                  ×
                </CloseButton>
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

export { ModalBody, ModalFooter, ModalFooterSpacer } from './modal.style'
