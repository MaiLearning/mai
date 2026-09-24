import type { ReactNode } from 'react'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
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
} from '../../../src/components/primitive/popover/popover.style'
import { usePopover } from '../../../src/components/primitive/popover/usePopover'
import { MenuWrapper, TriggerSlot } from './dropdownMenu.style'

export interface DropdownMenuItem {
  id: string
  label: string
  icon?: ReactNode
  hint?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export interface DropdownMenuSeparator {
  type: 'separator'
}

export interface DropdownMenuLabel {
  type: 'label'
  label: string
}

export type DropdownMenuPart = DropdownMenuItem | DropdownMenuSeparator | DropdownMenuLabel

export interface DropdownMenuProps {
  /** Содержимое триггера (кнопка, иконка и т.д.); клик открывает меню. */
  trigger: ReactNode
  items: readonly DropdownMenuPart[]
  disabled?: boolean
  'aria-label'?: string
}

/**
 * Выпадающее меню действий. Триггер оборачивается в слот, ловящий клик;
 * панель рендерится порталом в body поверх всего. Закрытие — кликом вне
 * / Esc, навигация — клавиатурой (↑ ↓ Home End Enter).
 *
 * @example
 * <DropdownMenu trigger={<Button variant="ghost">…</Button>}
 *   items={[{ id: 'rename', label: 'Переименовать' }, { type: 'separator' }]} />
 */
export function DropdownMenu({
  trigger,
  items,
  disabled,
  'aria-label': ariaLabel,
}: DropdownMenuProps) {
  const { opened, close, toggle, triggerRef, panelRef, coords } = usePopover<HTMLSpanElement>()
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const focusableIndexes = useMemo(
    () =>
      items
        .map((item, i) => ('type' in item ? -1 : item.disabled ? -1 : i))
        .filter((i) => i !== -1),
    [items],
  )

  useEffect(() => {
    if (opened) setActiveIndex(focusableIndexes[0] ?? -1)
  }, [opened, focusableIndexes])

  useLayoutEffect(() => {
    if (!opened) return
    panelRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({
      block: 'nearest',
    })
  }, [opened, activeIndex, panelRef])

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
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
        break
      }
      case 'Home':
        event.preventDefault()
        setActiveIndex(focusableIndexes[0] ?? -1)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(focusableIndexes[focusableIndexes.length - 1] ?? -1)
        break
      case 'Enter':
      case ' ': {
        const item = items[activeIndex]
        if (item && !('type' in item) && !item.disabled) {
          event.preventDefault()
          item.onSelect?.()
          close()
        }
        break
      }
      case 'Tab':
        close()
        break
    }
  }

  return (
    <MenuWrapper>
      <TriggerSlot
        ref={triggerRef}
        onClick={(event) => {
          if (disabled) return
          event.stopPropagation()
          toggle()
        }}
      >
        {trigger}
      </TriggerSlot>

      {opened &&
        createPortal(
          <MenuSurface
            ref={panelRef}
            role="menu"
            aria-label={ariaLabel}
            tabIndex={-1}
            style={{ left: coords.left, top: coords.top }}
            onKeyDown={onKeyDown}
          >
            <MenuList>
              {items.map((item, index) => {
                if ('type' in item) {
                  return item.type === 'separator' ? (
                    <MenuSeparator key={`sep-${index}`} role="separator" />
                  ) : (
                    <SectionLabel key={`label-${index}`}>{item.label}</SectionLabel>
                  )
                }

                return (
                  <li key={item.id}>
                    <MenuItemButton
                      type="button"
                      role="menuitem"
                      $danger={item.danger}
                      $active={index === activeIndex}
                      data-active={index === activeIndex || undefined}
                      disabled={item.disabled}
                      onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                      onClick={() => {
                        item.onSelect?.()
                        close()
                      }}
                    >
                      {item.icon ? (
                        <ItemIcon $danger={item.danger}>{item.icon}</ItemIcon>
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
          </MenuSurface>,
          document.body,
        )}
    </MenuWrapper>
  )
}
