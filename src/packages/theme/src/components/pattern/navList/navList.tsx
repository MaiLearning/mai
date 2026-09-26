import type { ReactNode } from 'react'
import {
  Group,
  GroupTitle,
  Item,
  ItemAside,
  ItemIcon,
  ItemLabel,
  List,
  NavListRoot,
  NestedList,
} from './navList.style'

export interface NavListItem {
  /** Идентификатор пункта (для activeId и onSelect). */
  id: string
  /** Подпись пункта. */
  label: string
  /** Иконка слева. */
  icon?: ReactNode
  /** Пункт недоступен для выбора. */
  disabled?: boolean
  /** Дополнительный контент справа (счётчик, бейдж). */
  aside?: ReactNode
  /** Вложенные пункты (отображаются с отступом). */
  children?: readonly NavListItem[]
}

export interface NavListGroup {
  /** Ключ группы. */
  id?: string
  /** Заголовок группы над списком. */
  title?: string
  /** Пункты группы. */
  items: readonly NavListItem[]
}

export interface NavListProps {
  /** Секции навигации. Каждая секция может иметь заголовок. */
  groups: readonly NavListGroup[]
  /** Активный пункт. */
  activeId?: string
  onSelect: (id: string) => void
  /** Доступное имя навигации. */
  ariaLabel?: string
  className?: string
}

interface LevelProps {
  items: readonly NavListItem[]
  activeId?: string
  onSelect: (id: string) => void
  nested?: boolean
  parentDisabled?: boolean
}

function Level({ items, activeId, onSelect, nested, parentDisabled = false }: LevelProps) {
  const ListRoot = nested ? NestedList : List

  return (
    <ListRoot>
      {items.map((item) => {
        const disabled = item.disabled === true || parentDisabled
        const active = !disabled && item.id === activeId

        return (
          <div key={item.id}>
            <Item
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
              {item.icon ? <ItemIcon>{item.icon}</ItemIcon> : null}
              <ItemLabel>{item.label}</ItemLabel>
              {item.aside ? <ItemAside>{item.aside}</ItemAside> : null}
            </Item>
            {item.children?.length ? (
              <Level
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
    </ListRoot>
  )
}

/**
 * NavList — вертикальный список навигации с группами и вложенными пунктами.
 * Пункт — кнопка с иконкой и подписью; активный выделяется акцентной
 * подложкой, disabled недоступен для выбора. Состояние выбора приходит извне.
 *
 * @example
 * <NavList
 *   activeId="general"
 *   onSelect={setId}
 *   groups={[
 *     { title: 'Настройки', items: [{ id: 'general', label: 'Общие', icon: <Icon name="settings" /> }] },
 *   ]}
 * />
 */
export function NavList({ groups, activeId, onSelect, ariaLabel, className }: NavListProps) {
  return (
    <NavListRoot className={className} aria-label={ariaLabel}>
      {groups.map((group, index) => (
        <Group key={group.id ?? group.title ?? index}>
          {group.title ? <GroupTitle>{group.title}</GroupTitle> : null}
          <Level items={group.items} activeId={activeId} onSelect={onSelect} />
        </Group>
      ))}
    </NavListRoot>
  )
}
