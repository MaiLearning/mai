import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePopover } from '../popover/usePopover'
import {
  SelectChevron,
  SelectOptionButton,
  SelectOptionText,
  SelectPanel,
  SelectTrigger,
  SelectWrapper,
} from './select.style'

export interface SelectItem {
  value: string
  label: string
}

export interface SelectProps {
  /** Выбранное значение. */
  value: string
  onChange: (value: string) => void
  items: readonly SelectItem[]
  placeholder?: string
  disabled?: boolean
  id?: string
  'aria-label'?: string
  className?: string
}

/**
 * Выпадающий список одиночного выбора. Раскрывается панелью-списком под
 * триггером: выбор пунктом или клавиатурой (↑ ↓ Home End Enter Esc),
 * закрытие — кликом вне / Esc.
 */
export function Select({
  value,
  onChange,
  items,
  placeholder = 'Выбрать…',
  disabled,
  id,
  'aria-label': ariaLabel,
  className,
}: SelectProps) {
  const { opened, close, toggle, triggerRef, panelRef, coords } = usePopover<HTMLButtonElement>()
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const selected = items.find((item) => item.value === value)

  const openPanel = useCallback(() => {
    const index = items.findIndex((item) => item.value === value)
    setActiveIndex(index >= 0 ? index : 0)
    toggle()
  }, [items, value, toggle])

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault()
        const dir = event.key === 'ArrowDown' ? 1 : -1
        const next = (activeIndex + dir + items.length) % items.length
        setActiveIndex(next)
        break
      }
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(items.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (items[activeIndex]) {
          onChange(items[activeIndex].value)
          close()
        }
        break
      case 'Tab':
        close()
        break
    }
  }

  return (
    <SelectWrapper className={className}>
      <SelectTrigger
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={opened}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        $opened={opened}
        onClick={openPanel}
      >
        <SelectOptionText $placeholder={!selected}>
          {selected ? selected.label : placeholder}
        </SelectOptionText>
        <SelectChevron $opened={opened} aria-hidden>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </SelectChevron>
      </SelectTrigger>

      {opened &&
        createPortal(
          <SelectPanel
            ref={panelRef}
            role="listbox"
            aria-label={ariaLabel}
            tabIndex={-1}
            style={{ left: coords.left, top: coords.top }}
            onKeyDown={onKeyDown}
          >
            {items.map((item, index) => (
              <SelectOptionButton
                key={item.value}
                type="button"
                role="option"
                aria-selected={item.value === value}
                $selected={item.value === value}
                $active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  onChange(item.value)
                  close()
                }}
              >
                <SelectOptionText>{item.label}</SelectOptionText>
              </SelectOptionButton>
            ))}
          </SelectPanel>,
          document.body,
        )}
    </SelectWrapper>
  )
}
