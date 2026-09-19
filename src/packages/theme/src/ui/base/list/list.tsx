import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, RefObject } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ListItemRoot, ListRoot } from './list.style'

export type ListKey = string
export type ListSelectionMode = 'none' | 'single' | 'multiple'
export type ListDirection = 'vertical' | 'horizontal'
export type ListGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {})

interface ListContextValue {
  selectionMode: ListSelectionMode
  selectedKeys: Set<ListKey>
  focusedKey: ListKey | null
  activeKey: ListKey | null
  registerItem: (
    key: ListKey,
    ref: RefObject<HTMLDivElement | null>,
    disabled: boolean,
  ) => () => void
  focusItem: (key: ListKey) => void
  toggleSelection: (key: ListKey) => void
  setActiveKey: (key: ListKey | null) => void
}

const ListContext = createContext<ListContextValue | null>(null)

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  direction?: ListDirection
  gap?: ListGap
  selectionMode?: ListSelectionMode
  selectedKeys?: Iterable<ListKey>
  defaultSelectedKeys?: Iterable<ListKey>
  onSelectionChange?: (keys: ListKey[]) => void
  keyboardNavigation?: boolean
}

function toKeySet(keys: Iterable<ListKey> | undefined) {
  return new Set(keys ?? [])
}

export function List({
  children,
  direction = 'vertical',
  gap = 'xs',
  selectionMode = 'none',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  keyboardNavigation = true,
  onKeyDown,
  ...props
}: ListProps) {
  const items = useRef(
    new Map<ListKey, { ref: RefObject<HTMLDivElement | null>; disabled: boolean }>(),
  )
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState(() =>
    toKeySet(defaultSelectedKeys),
  )
  const [focusedKey, setFocusedKey] = useState<ListKey | null>(null)
  const [activeKey, setActiveKey] = useState<ListKey | null>(null)
  const selectedKeys =
    controlledSelectedKeys === undefined
      ? uncontrolledSelectedKeys
      : toKeySet(controlledSelectedKeys)

  const registerItem = useCallback(
    (key: ListKey, ref: RefObject<HTMLDivElement | null>, disabled: boolean) => {
      items.current.set(key, { ref, disabled })

      return () => items.current.delete(key)
    },
    [],
  )

  const focusItem = useCallback((key: ListKey) => {
    const item = items.current.get(key)
    if (!item || item.disabled) return
    item.ref.current?.focus()
    setFocusedKey(key)
  }, [])

  const toggleSelection = useCallback(
    (key: ListKey) => {
      if (selectionMode === 'none' || items.current.get(key)?.disabled) return
      const next = new Set(selectedKeys)
      if (selectionMode === 'single') {
        next.clear()
        next.add(key)
      } else if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      if (controlledSelectedKeys === undefined) setUncontrolledSelectedKeys(next)
      onSelectionChange?.([...next])
    },
    [controlledSelectedKeys, onSelectionChange, selectedKeys, selectionMode],
  )

  const context = useMemo<ListContextValue>(
    () => ({
      selectionMode,
      selectedKeys,
      focusedKey,
      activeKey,
      registerItem,
      focusItem,
      toggleSelection,
      setActiveKey,
    }),
    [activeKey, focusItem, focusedKey, registerItem, selectedKeys, selectionMode, toggleSelection],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !keyboardNavigation) return

    const enabledKeys = [...items.current].filter(([, item]) => !item.disabled).map(([key]) => key)
    if (!enabledKeys.length) return
    const currentIndex = focusedKey == null ? -1 : enabledKeys.indexOf(focusedKey)
    let nextIndex: number | null = null
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
      nextIndex = currentIndex < enabledKeys.length - 1 ? currentIndex + 1 : 0
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft')
      nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledKeys.length - 1
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = enabledKeys.length - 1
    if (nextIndex !== null) {
      event.preventDefault()
      focusItem(enabledKeys[nextIndex])
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (focusedKey != null) toggleSelection(focusedKey)
    }
  }

  const role = selectionMode === 'none' ? 'list' : 'listbox'

  return (
    <ListContext.Provider value={context}>
      <ListRoot
        {...props}
        $direction={direction}
        $gap={gap}
        role={role}
        aria-multiselectable={selectionMode === 'multiple' || undefined}
        onKeyDown={handleKeyDown}
      >
        {children}
      </ListRoot>
    </ListContext.Provider>
  )
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'onClick'> {
  id: ListKey
  children: ReactNode
  disabled?: boolean
  selected?: boolean
  focused?: boolean
  active?: boolean
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
}

export function ListItem({
  id,
  children,
  disabled = false,
  selected,
  focused,
  active,
  onClick,
  ...props
}: ListItemProps) {
  const context = useContext(ListContext)
  if (!context) throw new Error('List.Item должен находиться внутри List')

  const ref = useRef<HTMLDivElement>(null)
  const isSelected = selected ?? context.selectedKeys.has(id)
  const isFocused = focused ?? context.focusedKey === id
  const isActive = active ?? context.activeKey === id

  useEffect(() => context.registerItem(id, ref, disabled), [context, disabled, id])
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    context.toggleSelection(id)
    onClick?.(event)
  }

  const itemRole = context.selectionMode === 'none' ? 'listitem' : 'option'

  return (
    <ListItemRoot
      {...props}
      ref={ref}
      id={`list-item-${id}`}
      role={itemRole}
      tabIndex={disabled ? -1 : isFocused || context.focusedKey === null ? 0 : -1}
      aria-disabled={disabled || undefined}
      aria-selected={context.selectionMode === 'none' ? undefined : isSelected}
      data-list-item={id}
      $selected={isSelected}
      $focused={isFocused}
      $active={isActive}
      $disabled={disabled}
      onFocus={() => context.focusItem(id)}
      onPointerDown={() => !disabled && context.setActiveKey(id)}
      onPointerUp={() => context.setActiveKey(null)}
      onPointerLeave={() => context.setActiveKey(null)}
      onClick={handleClick}
    >
      {children}
    </ListItemRoot>
  )
}

export namespace List {
  export const Item = ListItem
}

export type ListComponent = typeof List & { Item: typeof ListItem }
