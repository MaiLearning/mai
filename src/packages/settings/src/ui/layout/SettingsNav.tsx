import type { ReactNode } from 'react'
import { Children, Group, Icon, Nav, NavItem } from './SettingsNav.style'

export interface SettingsNavItem {
  /** Идентификатор пункта (для activeId и onSelect). */
  id: string
  /** Подпись пункта. */
  label: string
  /** Иконка слева. */
  icon?: ReactNode
  /** Вложенные пункты. */
  children?: SettingsNavItem[]
  disabled?: boolean
}

export interface SettingsNavProps {
  items: SettingsNavItem[]
  /** Активный пункт. */
  activeId?: string
  onSelect: (id: string) => void
  /** Доступное имя навигации. */
  ariaLabel?: string
}

interface NavLevelProps {
  items: SettingsNavItem[]
  activeId?: string
  onSelect: (id: string) => void
  nested?: boolean
  parentDisabled?: boolean
}

function NavLevel({ items, activeId, onSelect, nested, parentDisabled = false }: NavLevelProps) {
  const Level = nested ? Children : Group

  return (
    <Level>
      {items.map((item) => {
        const disabled = item.disabled === true || parentDisabled
        const active = !disabled && item.id === activeId

        return (
          <div key={item.id}>
            <NavItem
              type="button"
              disabled={disabled}
              $active={active}
              $disabled={disabled}
              data-active={active}
              aria-current={active ? 'page' : undefined}
              onClick={() => {
                if (!disabled) onSelect(item.id)
              }}
            >
              {item.icon ? <Icon>{item.icon}</Icon> : null}
              {item.label}
            </NavItem>
            {item.children?.length ? (
              <NavLevel
                items={item.children}
                activeId={activeId}
                onSelect={onSelect}
                nested
                parentDisabled={disabled}
              />
            ) : null}
          </div>
        )
      })}
    </Level>
  )
}

/** Навигация по разделам настроек с вложенными пунктами. */
export function SettingsNav({ items, activeId, onSelect, ariaLabel }: SettingsNavProps) {
  return (
    <Nav aria-label={ariaLabel}>
      <NavLevel items={items} activeId={activeId} onSelect={onSelect} />
    </Nav>
  )
}
