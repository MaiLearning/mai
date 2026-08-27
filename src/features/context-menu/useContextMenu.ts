import { type MouseEvent, useCallback, useState } from 'react'

export interface MenuState<TTarget> {
  x: number
  y: number
  targetId: TTarget | null
}

/**
 * Состояние контекстного меню для потребителя:
 * позиция открытия и идентификатор объекта, по которому кликнули.
 *
 * Состоянием владеет вызывающий компонент, а методы хука открывают меню
 * от нужного источника события (ПКМ по строке или кнопка «⋮»).
 */
export function useContextMenu<TTarget = string>() {
  const [state, setState] = useState<MenuState<TTarget> | null>(null)

  /** Открыть меню в произвольной точке вьюпорта. */
  const openAt = useCallback((x: number, y: number, targetId: TTarget | null = null) => {
    setState({ x, y, targetId })
  }, [])

  /** Открыть из нативного события правого клика. */
  const openFromEvent = useCallback((event: MouseEvent, targetId: TTarget | null = null) => {
    event.preventDefault()
    setState({ x: event.clientX, y: event.clientY, targetId })
  }, [])

  /** Открыть от кнопки («⋮»), выровняв меню под её левым нижним углом. */
  const openFromButton = useCallback(
    (event: MouseEvent<HTMLElement>, targetId: TTarget | null = null) => {
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      setState({ x: rect.left, y: rect.bottom + 4, targetId })
    },
    [],
  )

  const close = useCallback(() => setState(null), [])

  return { state, openAt, openFromEvent, openFromButton, close }
}
