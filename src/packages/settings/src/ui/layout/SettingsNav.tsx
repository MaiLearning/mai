import { NavList } from '@mai/theme'
import type { ReactNode } from 'react'

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

export interface SettingsNavGroup {
  /** Ключ группы. */
  id?: string
  /** Заголовок группы над списком. */
  title?: string
  /** Пункты группы. */
  items: SettingsNavItem[]
}

export interface SettingsNavProps {
  /** Группы пунктов настроек (системные, плагины, курсы). */
  groups: SettingsNavGroup[]
  /** Активный пункт. */
  activeId?: string
  onSelect: (id: string) => void
  /** Доступное имя навигации. */
  ariaLabel?: string
}

/**
 * Навигация по разделам настроек: группы пунктов с заголовками, иконки,
 * вложенные пункты. Тонкий адаптер над паттерном `NavList` темы.
 */
export function SettingsNav({ groups, activeId, onSelect, ariaLabel }: SettingsNavProps) {
  return <NavList groups={groups} activeId={activeId} onSelect={onSelect} ariaLabel={ariaLabel} />
}
