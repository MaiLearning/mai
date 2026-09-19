import { type ReactNode, useEffect, useRef } from 'react'
import { Anchor, Panel } from './Popover.style'

interface PopoverProps {
  open: boolean
  onClose: () => void
  /** Содержимое якоря: кнопка-триггер. */
  anchor: ReactNode
  /** Содержимое панели. */
  children: ReactNode
  align?: 'start' | 'end'
}

/**
 * Поповер: панель раскрывается под якорем. Закрытие — клик вне якоря
 * и Escape (Escape ловится в capture-фазе, см. прецедент ColorPairPicker).
 */
export function Popover({ open, onClose, anchor, children, align = 'end' }: PopoverProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(event.target as Node)) onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [open, onClose])

  return (
    <Anchor ref={anchorRef}>
      {anchor}
      {open && (
        <Panel role="menu" $align={align}>
          {children}
        </Panel>
      )}
    </Anchor>
  )
}
