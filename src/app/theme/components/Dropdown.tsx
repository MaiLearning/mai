import { Check, ChevronDown } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { MenuPosition } from './Dropdown.style'
import {
  Empty,
  MENU_GAP,
  MENU_MAX_HEIGHT,
  Menu,
  Option,
  Root,
  Trigger,
  TriggerLabel,
} from './Dropdown.style'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps {
  /** Текущее значение (должно совпадать с одной из опций). */
  value: string
  /** Варианты выбора. */
  options: DropdownOption[]
  onChange: (value: string) => void
  disabled?: boolean
  /** Текст триггера, если value не совпал ни с одной опцией. */
  placeholder?: string
  'aria-label'?: string
}

export function Dropdown({
  value,
  options,
  onChange,
  disabled,
  placeholder,
  'aria-label': ariaLabel,
}: DropdownProps) {
  const [opened, setOpened] = useState(false)
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const activeDescendant = activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined

  const measure = useCallback((): MenuPosition | null => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return null
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < MENU_MAX_HEIGHT && rect.top > spaceBelow

    return {
      left: rect.left,
      minWidth: rect.width,
      top: openUp ? undefined : rect.bottom + MENU_GAP,
      bottom: openUp ? window.innerHeight - rect.top + MENU_GAP : undefined,
    }
  }, [])

  const open = useCallback(() => {
    if (disabled) return
    setPosition(measure())
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : options.length > 0 ? 0 : -1)
    setOpened(true)
  }, [disabled, measure, options.length, selectedIndex])

  const close = useCallback(() => setOpened(false), [])

  const select = (option: DropdownOption) => {
    onChange(option.value)
    close()
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!opened) return
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      close()
    }
    const reposition = () => setPosition(measure())
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [opened, close, measure])

  useEffect(() => {
    if (!opened || activeIndex < 0) return
    menuRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [opened, activeIndex])

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (!opened) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        open()
      }

      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      triggerRef.current?.focus()

      return
    }
    if (event.key === 'Tab') {
      close()

      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) =>
        options.length === 0 ? -1 : (index + delta + options.length) % options.length,
      )

      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)

      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) select(option)
    }
  }

  return (
    <Root ref={rootRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        disabled={disabled}
        $opened={opened}
        aria-haspopup="listbox"
        aria-expanded={opened}
        aria-controls={opened ? listId : undefined}
        aria-activedescendant={opened ? activeDescendant : undefined}
        aria-label={ariaLabel}
        onClick={() => (opened ? close() : open())}
        onKeyDown={onKeyDown}
      >
        <TriggerLabel>
          {selectedIndex >= 0 ? options[selectedIndex].label : placeholder}
        </TriggerLabel>
        <ChevronDown size={16} aria-hidden />
      </Trigger>
      {opened &&
        position &&
        createPortal(
          <Menu ref={menuRef} role="listbox" id={listId} $position={position}>
            {options.map((option, index) => (
              <Option
                key={option.value}
                id={`${listId}-opt-${index}`}
                role="option"
                $active={index === activeIndex}
                $selected={index === selectedIndex}
                aria-selected={index === selectedIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(option)}
              >
                <span>{option.label}</span>
                {index === selectedIndex && <Check size={14} aria-hidden />}
              </Option>
            ))}
            {options.length === 0 && <Empty>Нет вариантов</Empty>}
          </Menu>,
          document.body,
        )}
    </Root>
  )
}
