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
}

function NavLevel({ items, activeId, onSelect, nested }: NavLevelProps) {
  const Level = nested ? Children : Group

  return (
    <Level>
      {items.map((item) => (
        <div key={item.id}>
          <NavItem
            type="button"
            $active={item.id === activeId}
            data-active={item.id === activeId}
            onClick={() => onSelect(item.id)}
          >
            {item.icon ? <Icon>{item.icon}</Icon> : null}
            {item.label}
          </NavItem>
          {item.children?.length ? (
            <NavLevel items={item.children} activeId={activeId} onSelect={onSelect} nested />
          ) : null}
        </div>
      ))}
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
