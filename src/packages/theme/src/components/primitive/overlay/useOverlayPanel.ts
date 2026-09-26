import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { CLOSE_DURATION_MS } from './overlay.style'

/** Фокусируемые элементы внутри панели — для focus-trap по Tab. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface UseOverlayPanelOptions {
  /** Открыта ли панель. */
  opened: boolean
  /** Запрос закрытия (Esc, клик вне панели). */
  onClose: () => void
  /** Разрешить закрытие по Esc. */
  dismissible?: boolean
  /** Длительность анимации закрытия, мс. */
  closeDuration?: number
}

export interface UseOverlayPanelResult {
  /** Смонтирован ли портал (с учётом анимации закрытия). */
  mounted: boolean
  /** Панель видима (используется для анимаций). */
  visible: boolean
  /** Идёт анимация закрытия. */
  closing: boolean
  /** Ref панели: focus-trap и автофокус. */
  panelRef: RefObject<HTMLDivElement | null>
  /** Обработчик клавиатуры панели: Esc + focus-trap. */
  onKeyDown: (event: React.KeyboardEvent) => void
}

/**
 * Общий механизм модальных панелей (Modal, Drawer): портал с анимацией
 * открытия/закрытия, блокировка скролла, восстановление фокуса, автофокус,
 * focus-trap по Tab и закрытие по Esc. Разметку подложки и панели компонент
 * задаёт сам.
 */
export function useOverlayPanel({
  opened,
  onClose,
  dismissible = true,
  closeDuration = CLOSE_DURATION_MS,
}: UseOverlayPanelOptions): UseOverlayPanelResult {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)
  const savedScrollY = useRef(0)

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
    }, closeDuration)

    return () => window.clearTimeout(timer)
  }, [opened, visible, closeDuration])

  // Блокировка скролла страницы на время видимости панели.
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

  // Автофокус первого фокусируемого элемента при открытии.
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

  return { mounted, visible, closing, panelRef, onKeyDown }
}
