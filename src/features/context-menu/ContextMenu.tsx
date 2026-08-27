import { ChevronRight, Trash2 } from 'lucide-react'
import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  ItemHint,
  ItemIcon,
  ItemLabel,
  MenuItemButton,
  MenuList,
  MenuSeparator,
  MenuSurface,
  SectionLabel,
  SubmenuChevron,
} from './ContextMenu.styles'
import type {
  ContextMenuItemProps,
  ContextMenuRootProps,
  ContextMenuSeparatorProps,
  ContextMenuSubProps,
  MenuItem,
} from './types'

const MENU_WIDTH = 232
const EDGE_GAP = 8

// ================================================================
//  Маркерные компоненты составных частей (Compound Components)
//
//  Это не рендер-компоненты: они описывают декларативный состав меню.
//  Корень обходит детей и превращает их во внутреннюю модель MenuItem,
//  после чего рендерит меню портал в body.
// ================================================================

/** Пункт меню: подпись, иконка слева, горячая клавиша справа. */
function ItemPart(_props: ContextMenuItemProps): null {
  return null
}

/** Пункт-подменю («Переместить в»): открывает вложенное окно с дочерними пунктами. */
function SubPart(_props: ContextMenuSubProps): null {
  return null
}

/** Разделитель между группами действий. */
function SeparatorPart(_props: ContextMenuSeparatorProps): null {
  return null
}

/** Заголовок секции внутри меню. */
function HeaderPart(_props: { label: string }): null {
  return null
}

// ================================================================
//  Декларативные элементы → внутренняя модель
// ================================================================

type PartElement = ReactElement<{
  id?: string
  label?: string
  icon?: ReactNode
  hotkey?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
  children?: ReactNode
}>

/**
 * Собирает один уровень декларативных элементов в MenuItem[].
 * Рекурсивно разворачивает фрагменты и детей у SubPart (подменю).
 */
function collectLevel(node: ReactNode): MenuItem[] {
  const out: MenuItem[] = []

  Children.forEach(node, (child, index) => {
    if (!isValidElement(child)) return

    // Фрагменты и условная сборка (<>...</>) разворачиваются прозрачно.
    if (child.type === Fragment) {
      out.push(...collectLevel((child.props as { children?: ReactNode }).children))
      return
    }

    const element = child as unknown as PartElement
    const props = element.props ?? {}

    switch (element.type) {
      case ItemPart:
      case SubPart: {
        const item: MenuItem = {
          type: 'item',
          id: props.id ?? `cm-item-${index}-${out.length}`,
          label: props.label ?? '',
          tone: props.danger ? 'danger' : 'default',
        }
        if (props.icon !== undefined) item.icon = props.icon
        if (props.hotkey !== undefined) item.hint = props.hotkey
        if (props.disabled !== undefined) item.disabled = props.disabled
        if (props.onSelect !== undefined) item.onSelect = props.onSelect
        if (element.type === SubPart && props.children != null) {
          item.children = collectLevel(props.children)
        }
        out.push(item)
        break
      }
      case SeparatorPart:
        out.push({ type: 'separator' })
        break
      case HeaderPart:
        out.push({ type: 'label', label: props.label ?? '' })
        break
      default:
        break
    }
  })

  return out
}

// ================================================================
//  Движок рендера
// ================================================================

/** Вложенное подменю: абсолютное позиционирование справа от родительского пункта. */
function NestedMenu({ items, onSelectLeaf }: { items: MenuItem[]; onSelectLeaf: () => void }) {
  return (
    <MenuSurface
      role="menu"
      style={{ position: 'absolute', top: -6, left: '100%', marginLeft: 6, width: MENU_WIDTH }}
    >
      <MenuList>
        {items.map((item, index) => {
          if (item.type === 'separator')
            return <MenuSeparator key={`sep-${index}`} role="separator" />
          if (item.type === 'label')
            return <SectionLabel key={`label-${index}`}>{item.label}</SectionLabel>
          return (
            <li key={item.id}>
              <MenuItemButton
                role="menuitem"
                type="button"
                $danger={item.tone === 'danger'}
                disabled={item.disabled}
                onClick={() => {
                  item.onSelect?.()
                  onSelectLeaf()
                }}
              >
                {item.icon ? (
                  <ItemIcon $danger={item.tone === 'danger'}>{item.icon}</ItemIcon>
                ) : (
                  <ItemIcon aria-hidden />
                )}
                <ItemLabel>{item.label}</ItemLabel>
                {item.hint ? <ItemHint>{item.hint}</ItemHint> : null}
              </MenuItemButton>
            </li>
          )
        })}
      </MenuList>
    </MenuSurface>
  )
}

/**
 * Контекстное меню (Compound Components).
 *
 * Состав задаётся потребителем декларативно; внутри фичи живёт вся логика:
 * позиционирование с флипом от краёв вьюпорта, закрытие по клику вне / Esc,
 * клавиатурная навигация (↑ ↓ Enter Space), подменю по наведению.
 *
 * @example
 * ```tsx
 * <ContextMenu opened x={100} y={100} onClose={close} onDelete={() => remove()}>
 *   <ContextMenu.Item label="Переименовать" icon={<Pen />} hotkey="F2" onSelect={rename} />
 *   <ContextMenu.Sub label="Переместить в" icon={<FolderInput />}>
 *     <ContextMenu.Item label="Введение" onSelect={() => move('folder-intro')} />
 *   </ContextMenu.Sub>
 * </ContextMenu>
 * ```
 */
function ContextMenuRoot({
  opened,
  x,
  y,
  onClose,
  title,
  onDelete,
  children,
}: ContextMenuRootProps): ReactNode {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: x, top: y })
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  /** Встроенное действие «Удалить»: дописывается после разделителя. */
  const items = useMemo<MenuItem[]>(() => {
    const base = collectLevel(children)
    if (!onDelete) return base

    return [
      ...base,
      { type: 'separator' },
      {
        type: 'item',
        id: 'cm-delete',
        label: 'Удалить',
        icon: <Trash2 size={16} />,
        tone: 'danger',
        onSelect: onDelete,
      },
    ]
  }, [children, onDelete])

  const focusableIndexes = useMemo(
    () =>
      items.map((it, i) => (it.type === 'item' && !it.disabled ? i : -1)).filter((i) => i !== -1),
    [items],
  )

  // При каждом открытии начинаем навигацию заново.
  useEffect(() => {
    if (!opened) return
    setPos({ left: x, top: y })
    setOpenSubmenu(null)
    setActiveIndex(-1)
  }, [opened, x, y])

  // Позиционирование с флипом: не даём окну выехать за края вьюпорта.
  useLayoutEffect(() => {
    if (!opened) return

    const element = surfaceRef.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = x
    let top = y
    if (left + rect.width + EDGE_GAP > vw) left = Math.max(EDGE_GAP, x - rect.width)
    if (top + rect.height + EDGE_GAP > vh) top = Math.max(EDGE_GAP, vh - rect.height - EDGE_GAP)
    setPos({ left, top })
  }, [x, y, items, opened])

  useEffect(() => {
    if (!opened) return

    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (surfaceRef.current && !surfaceRef.current.contains(event.target as Node)) onClose()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        const dir = event.key === 'ArrowDown' ? 1 : -1
        const current = focusableIndexes.indexOf(activeIndex)
        const nextPos =
          current === -1
            ? dir === 1
              ? 0
              : focusableIndexes.length - 1
            : (current + dir + focusableIndexes.length) % focusableIndexes.length
        const next = focusableIndexes[nextPos]
        if (next !== undefined) setActiveIndex(next)
        return
      }

      if (event.key === 'Enter' || event.key === ' ') {
        const item = items[activeIndex]
        if (item?.type === 'item' && !item.disabled) {
          event.preventDefault()
          runItem(item)
        }
      }
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items, focusableIndexes, onClose, opened])

  function runItem(item: Extract<MenuItem, { type: 'item' }>) {
    if (item.children?.length) {
      setOpenSubmenu((prev) => (prev === item.id ? null : item.id))
      return
    }
    item.onSelect?.()
    onClose()
  }

  if (!opened) return null

  return createPortal(
    <MenuSurface
      ref={surfaceRef}
      role="menu"
      aria-label={title ?? 'Контекстное меню'}
      style={{ left: pos.left, top: pos.top, width: MENU_WIDTH }}
    >
      {title ? <SectionLabel as="div">{title}</SectionLabel> : null}
      <MenuList>
        {items.map((item, index) => {
          if (item.type === 'separator')
            return <MenuSeparator key={`sep-${index}`} role="separator" />
          if (item.type === 'label')
            return <SectionLabel key={`label-${index}`}>{item.label}</SectionLabel>

          const hasChildren = !!item.children?.length
          return (
            <li key={item.id} style={{ position: 'relative' }}>
              <MenuItemButton
                role="menuitem"
                type="button"
                $danger={item.tone === 'danger'}
                $active={activeIndex === index}
                disabled={item.disabled}
                aria-haspopup={hasChildren || undefined}
                aria-expanded={hasChildren ? openSubmenu === item.id : undefined}
                onMouseEnter={() => {
                  setActiveIndex(index)
                  setOpenSubmenu(hasChildren ? item.id : null)
                }}
                onClick={() => runItem(item)}
              >
                {item.icon ? (
                  <ItemIcon $danger={item.tone === 'danger'}>{item.icon}</ItemIcon>
                ) : (
                  <ItemIcon aria-hidden />
                )}
                <ItemLabel>{item.label}</ItemLabel>
                {item.hint ? <ItemHint>{item.hint}</ItemHint> : null}
                {hasChildren ? (
                  <SubmenuChevron aria-hidden>
                    <ChevronRight size={15} />
                  </SubmenuChevron>
                ) : null}
              </MenuItemButton>

              {hasChildren && openSubmenu === item.id ? (
                <NestedMenu items={item.children ?? []} onSelectLeaf={onClose} />
              ) : null}
            </li>
          )
        })}
      </MenuList>
    </MenuSurface>,
    document.body,
  )
}

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Item: ItemPart,
  Sub: SubPart,
  Separator: SeparatorPart,
  Header: HeaderPart,
})
