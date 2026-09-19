import type { CSSProperties, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ListProps, ListSelectionMode } from '../base/list/list'
import { List } from '../base/list/list'
import {
  HierarchicalListItem as HierarchicalListItemRoot,
  ToggleButton,
  ToggleChevron,
} from './hierarchicalList.style'

interface RegisteredItem {
  value: string
  parentValue: string | null
  disabled: boolean
}

interface HierarchicalListContextValue {
  expandedValues: Set<string>
  registerItem: (item: RegisteredItem) => () => void
  toggleExpanded: (value: string) => void
  isVisible: (value: string, parentValue: string | null) => boolean
  hasChildren: (value: string) => boolean
  getVisibleValues: () => string[]
  getParentValue: (value: string) => string | null
}

const HierarchicalListContext = createContext<HierarchicalListContextValue | null>(null)

interface ItemParentContextValue {
  value: string | null
  depth: number
}

const ItemParentContext = createContext<ItemParentContextValue>({ value: null, depth: -1 })

export interface HierarchicalListProps
  extends Omit<
    ListProps,
    'children' | 'direction' | 'gap' | 'onKeyDown' | 'selectedKeys' | 'defaultSelectedKeys'
  > {
  children: ReactNode
  selectionMode?: ListSelectionMode
  selectedKeys?: Iterable<string>
  defaultSelectedKeys?: Iterable<string>
  onSelectionChange?: (keys: string[]) => void
  expandedValues?: Iterable<string>
  defaultExpandedValues?: Iterable<string>
  onExpandedChange?: (values: string[]) => void
  onKeyDown?: ListProps['onKeyDown']
}

export interface HierarchicalListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'children'> {
  value: string
  children: ReactNode
  disabled?: boolean
}

function createVisibleOrder(items: Map<string, RegisteredItem>, expandedValues: Set<string>) {
  const childrenByParent = new Map<string | null, string[]>()
  for (const item of items.values()) {
    const children = childrenByParent.get(item.parentValue) ?? []
    children.push(item.value)
    childrenByParent.set(item.parentValue, children)
  }

  const values: string[] = []
  const visit = (parentValue: string | null) => {
    for (const value of childrenByParent.get(parentValue) ?? []) {
      values.push(value)
      if (expandedValues.has(value)) visit(value)
    }
  }
  visit(null)

  return values
}

export function HierarchicalList({
  children,
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  expandedValues: controlledExpandedValues,
  defaultExpandedValues,
  onExpandedChange,
  onKeyDown,
  ...props
}: HierarchicalListProps) {
  const items = useRef(new Map<string, RegisteredItem>())
  const [, forceUpdate] = useState(0)
  const [uncontrolledExpandedValues, setUncontrolledExpandedValues] = useState(
    () => new Set(defaultExpandedValues ?? []),
  )
  const expandedValues =
    controlledExpandedValues === undefined
      ? uncontrolledExpandedValues
      : new Set(controlledExpandedValues)

  const registerItem = useCallback((item: RegisteredItem) => {
    items.current.set(item.value, item)
    forceUpdate((version) => version + 1)

    return () => {
      items.current.delete(item.value)
      forceUpdate((version) => version + 1)
    }
  }, [])

  const toggleExpanded = useCallback(
    (value: string) => {
      const next = new Set(expandedValues)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      if (controlledExpandedValues === undefined) setUncontrolledExpandedValues(next)
      onExpandedChange?.([...next])
    },
    [controlledExpandedValues, expandedValues, onExpandedChange],
  )

  const isVisible = useCallback(
    (value: string, parentValue: string | null) => {
      let current = parentValue
      while (current !== null) {
        if (!expandedValues.has(current)) return false
        current = items.current.get(current)?.parentValue ?? null
      }

      return items.current.has(value)
    },
    [expandedValues],
  )

  const context = useMemo<HierarchicalListContextValue>(
    () => ({
      expandedValues,
      registerItem,
      toggleExpanded,
      isVisible,
      hasChildren: (value) =>
        [...items.current.values()].some((item) => item.parentValue === value),
      getVisibleValues: () => createVisibleOrder(items.current, expandedValues),
      getParentValue: (value) => items.current.get(value)?.parentValue ?? null,
    }),
    [expandedValues, isVisible, registerItem, toggleExpanded],
  )

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return

    const currentValue = (event.target as HTMLElement).closest<HTMLElement>('[data-list-item]')
      ?.dataset.listItem
    if (!currentValue) return

    const visibleValues = context.getVisibleValues()
    const currentIndex = visibleValues.indexOf(currentValue)
    if (currentIndex === -1) return
    const parentValue = context.getParentValue(currentValue)

    if (event.key === 'ArrowRight') {
      const hasChildren = [...items.current.values()].some(
        (item) => item.parentValue === currentValue,
      )
      if (hasChildren) {
        event.preventDefault()
        if (!expandedValues.has(currentValue)) {
          toggleExpanded(currentValue)
        } else {
          document.getElementById(`list-item-${visibleValues[currentIndex + 1]}`)?.focus()
        }
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (expandedValues.has(currentValue)) toggleExpanded(currentValue)
      else if (parentValue) document.getElementById(`list-item-${parentValue}`)?.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const offset = event.key === 'ArrowDown' ? 1 : -1
      document.getElementById(`list-item-${visibleValues[currentIndex + offset]}`)?.focus()
    }
  }

  return (
    <HierarchicalListContext.Provider value={context}>
      <List
        {...props}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={defaultSelectedKeys}
        onSelectionChange={onSelectionChange}
        onKeyDown={handleKeyDown}
      >
        {children}
      </List>
    </HierarchicalListContext.Provider>
  )
}

function HierarchicalListItem({
  value,
  children,
  disabled = false,
  style,
  onClick,
  ...props
}: HierarchicalListItemProps) {
  const listContext = useContext(HierarchicalListContext)
  const parentContext = useContext(ItemParentContext)
  const parentValue = parentContext.value
  if (!listContext)
    throw new Error('HierarchicalList.Item должен находиться внутри HierarchicalList')

  const item = useMemo(() => ({ value, parentValue, disabled }), [disabled, parentValue, value])
  useEffect(() => listContext.registerItem(item), [item, listContext])

  const visible = listContext.isVisible(value, parentValue)
  const hasChildren = listContext.hasChildren(value)
  const expanded = listContext.expandedValues.has(value)
  const itemStyle: CSSProperties = visible ? { ...style } : { ...style, display: 'none' }

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    listContext.toggleExpanded(value)
  }

  return (
    <ItemParentContext.Provider value={{ value, depth: parentContext.depth + 1 }}>
      <HierarchicalListItemRoot $depth={parentContext.depth + 1}>
        <List.Item
          {...props}
          id={value}
          disabled={disabled}
          style={{ ...itemStyle, flexWrap: 'wrap' }}
          data-list-item={value}
          onClick={(event) => {
            event.stopPropagation()
            onClick?.(event)
          }}
        >
          {hasChildren && (
            <ToggleButton
              type="button"
              aria-label={expanded ? 'Свернуть' : 'Развернуть'}
              aria-expanded={expanded}
              onClick={handleToggle}
            >
              <ToggleChevron $expanded={expanded} />
            </ToggleButton>
          )}
          {children}
        </List.Item>
      </HierarchicalListItemRoot>
    </ItemParentContext.Provider>
  )
}

export namespace HierarchicalList {
  export const Item = HierarchicalListItem
}
