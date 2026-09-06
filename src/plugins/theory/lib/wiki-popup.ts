import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import type { WikiResourceItem } from './course-resources'

/** Состояние всплывающего меню wiki-автокомплита (рендерится в дереве viewer-а). */
export interface WikiPopupState {
  open: boolean
  items: WikiResourceItem[]
  selected: number
  /** Позиция меню в координатах окна (fixed-позиционирование). */
  rect: { top: number; left: number } | null
}

const CLOSED: WikiPopupState = { open: false, items: [], selected: 0, rect: null }

let state: WikiPopupState = CLOSED
const listeners = new Set<() => void>()
let activeProps: SuggestionProps<WikiResourceItem> | null = null

function notify(): void {
  listeners.forEach((listen) => listen())
}

function commit(next: WikiPopupState): void {
  state = next
  notify()
}

function clamp(items: WikiResourceItem[], selected: number): number {
  return Math.max(0, Math.min(selected, items.length - 1))
}

function openMenu(props: SuggestionProps<WikiResourceItem>): void {
  activeProps = props
  commit({ open: true, items: props.items, selected: 0, rect: rectOf(props) })
}

function updateMenu(props: SuggestionProps<WikiResourceItem>): void {
  activeProps = props
  const selected = clamp(props.items, state.selected)
  commit({ open: true, items: props.items, selected, rect: rectOf(props) })
}

function rectOf(props: SuggestionProps<WikiResourceItem>): { top: number; left: number } | null {
  const rect = props.clientRect?.()
  if (!rect) return null

  return { top: rect.bottom + 6, left: rect.left }
}

function exitMenu(): void {
  activeProps = null
  commit(CLOSED)
}

function moveSelection(delta: number): void {
  commit({ ...state, selected: clamp(state.items, state.selected + delta) })
}

function pickSelected(): boolean {
  const item = state.items[state.selected]
  if (!item || !activeProps) return false

  activeProps.command(item)

  return true
}

/** Обработка клавиш, пока меню открыто. Возвращает true, если клавиша поглощена. */
function handleKeyDown({ event }: SuggestionKeyDownProps): boolean {
  if (!state.open || !activeProps) return false

  if (event.key === 'ArrowDown') {
    moveSelection(1)

    return true
  }
  if (event.key === 'ArrowUp') {
    moveSelection(-1)

    return true
  }
  if (event.key === 'Enter') return pickSelected()
  if (event.key === 'Escape') {
    exitMenu()

    return true
  }

  return false
}

/**
 * Синглтон-контроллер всплывающего меню `[[`-автокомплита.
 * Расширение wiki-suggestions двигает состояние, viewer подписывается и рендерит
 * меню внутри своего React-дерева (тема и i18n — из контекста).
 */
export const wikiPopup = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener)

    return () => listeners.delete(listener)
  },
  getSnapshot(): WikiPopupState {
    return state
  },
  getServerSnapshot(): WikiPopupState {
    return CLOSED
  },
  start: openMenu,
  update: updateMenu,
  exit: exitMenu,
  handleKeyDown,
  /** Выбор пункта мышью (использует props последнего обновления). */
  pick(item: WikiResourceItem): void {
    if (activeProps) activeProps.command(item)
  },
}
