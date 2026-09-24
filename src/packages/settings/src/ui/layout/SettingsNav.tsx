import type { ReactNode } from 'react'
import styles from './SettingsNav.module.css'

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
  return (
    <div className={nested ? styles.children : styles.group}>
      {items.map((item) => (
        <div key={item.id}>
          <button
            type="button"
            className={styles.item}
            data-active={item.id === activeId}
            onClick={() => onSelect(item.id)}
          >
            {item.icon ? <span className={styles.icon}>{item.icon}</span> : null}
            {item.label}
          </button>
          {item.children?.length ? (
            <NavLevel items={item.children} activeId={activeId} onSelect={onSelect} nested />
          ) : null}
        </div>
      ))}
    </div>
  )
}

/** Навигация по разделам настроек с вложенными пунктами. */
export function SettingsNav({ items, activeId, onSelect, ariaLabel }: SettingsNavProps) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <NavLevel items={items} activeId={activeId} onSelect={onSelect} />
    </nav>
  )
}
