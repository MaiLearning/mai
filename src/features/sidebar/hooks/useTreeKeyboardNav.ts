import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import type { FlattenedItem } from '../model/tree-utils'

interface UseTreeKeyboardNavParams {
  /** Видимые строки дерева (уже свёрнутые/отфильтрованные). */
  rows: FlattenedItem[]
  selectedId?: string | null
  isExpanded: (item: FlattenedItem) => boolean
  onToggle: (id: string) => void
  /** Выбор узла: получает плоский элемент, конвертация — на вызывающей стороне. */
  onSelect: (item: FlattenedItem) => void
}

/**
 * Клавиатурная навигация по дереву: стрелки (вверх/вниз/влево/вправо),
 * Home/End, Enter/Space. Владеет фокусом строк (focusedId + DOM-фокус)
 * и реестром ссылок на DOM-элементы строк.
 */
export function useTreeKeyboardNav({
  rows,
  selectedId,
  isExpanded,
  onToggle,
  onSelect,
}: UseTreeKeyboardNavParams) {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const activeId = focusedId ?? selectedId ?? rows[0]?.id ?? null

  useEffect(() => {
    if (focusedId && !rows.some((row) => row.id === focusedId)) setFocusedId(null)
  }, [rows, focusedId])

  /** Установить фокус на строку (состояние + DOM). */
  const focusRow = useCallback((id: string) => {
    setFocusedId(id)
    rowRefs.current.get(id)?.focus()
  }, [])

  /** Отметить строку активной без принудительного DOM-фокуса (onFocus строки). */
  const markFocused = useCallback((id: string) => setFocusedId(id), [])

  const registerRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) rowRefs.current.set(id, element)
    else rowRefs.current.delete(id)
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!activeId) return
      const index = rows.findIndex((row) => row.id === activeId)
      if (index === -1) return
      const current = rows[index]

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          if (rows[index + 1]) focusRow(rows[index + 1].id)
          break
        case 'ArrowUp':
          event.preventDefault()
          if (rows[index - 1]) focusRow(rows[index - 1].id)
          break
        case 'ArrowRight':
          event.preventDefault()
          if (current.hasChildren && !isExpanded(current)) onToggle(current.id)
          else if (rows[index + 1]?.parentId === current.id) focusRow(rows[index + 1].id)
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (current.hasChildren && isExpanded(current)) onToggle(current.id)
          else if (current.parentId) focusRow(current.parentId)
          break
        case 'Home':
          event.preventDefault()
          if (rows[0]) focusRow(rows[0].id)
          break
        case 'End':
          event.preventDefault()
          if (rows[rows.length - 1]) focusRow(rows[rows.length - 1].id)
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          onSelect(current)
          if (current.hasChildren) onToggle(current.id)
          break
        default:
          break
      }
    },
    [activeId, rows, isExpanded, onToggle, onSelect, focusRow],
  )

  return { activeId, focusRow, markFocused, registerRef, handleKeyDown }
}
