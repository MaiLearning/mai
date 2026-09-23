import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export interface PopoverCoords {
  left: number
  top: number
}

/** Зазор между триггером и панелью. */
const GAP = 6
/** Отступ от краёв вьюпорта. */
const EDGE_GAP = 8

/**
 * Инфраструктура всплывающих панелей (выпадающие списки, меню).
 *
 * Владеет состоянием открытия, позиционированием с флипом от краёв
 * вьюпорта, закрытием по клику вне/`Esc` и фокусировкой панели при
 * открытии. Поведение общее для `Select` и `DropdownMenu`.
 *
 * Использование: оба — триггер (ref через `triggerRef`) и панель
 * (`panelRef`) — рендерятся потребителем; панель монтируется только
 * при `opened` и должна быть способна принять фокус (`tabIndex={-1}`).
 *
 * @example
 * const { opened, close, toggle, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()
 * <button ref={triggerRef} onClick={toggle}>…</button>
 * {opened && <Panel ref={panelRef} tabIndex={-1} style={{ ...coords }} />}
 */
export function usePopover<TTrigger extends HTMLElement>() {
  const [opened, setOpened] = useState(false)
  const triggerRef = useRef<TTrigger | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [coords, setCoords] = useState<PopoverCoords>({ left: 0, top: 0 })

  const open = useCallback(() => setOpened(true), [])
  const close = useCallback(() => setOpened(false), [])
  const toggle = useCallback(() => setOpened((value) => !value), [])

  // Позиционирование с флипом: панель раскрывается под триггером, при
  // нехватке места — разворачивается вверх / влево, но не выходит за края.
  useLayoutEffect(() => {
    if (!opened) return

    const position = () => {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return

      const t = trigger.getBoundingClientRect()
      const p = panel.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      let left = t.left
      let top = t.bottom + GAP
      if (left + p.width + EDGE_GAP > vw) left = Math.max(EDGE_GAP, vw - p.width - EDGE_GAP)
      if (top + p.height + EDGE_GAP > vh) top = Math.max(EDGE_GAP, t.top - p.height - GAP)

      setCoords({ left, top })
    }

    position()
    window.addEventListener('resize', position)
    window.addEventListener('scroll', position, true)

    return () => {
      window.removeEventListener('resize', position)
      window.removeEventListener('scroll', position, true)
    }
  }, [opened])

  // Закрытие по клику вне панели и триггера, а также по Esc.
  useEffect(() => {
    if (!opened) return

    const onPointerDown = (event: globalThis.MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      close()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [opened, close])

  // Фокус на панель при открытии, чтобы клавиатурная навигация шла в неё.
  useLayoutEffect(() => {
    if (opened) panelRef.current?.focus()
  }, [opened])

  return { opened, open, close, toggle, triggerRef, panelRef, coords }
}
