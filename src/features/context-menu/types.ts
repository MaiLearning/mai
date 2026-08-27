import type { ReactNode } from 'react'

// ================================================================
//  Внутренняя модель меню (движок рендера и клавиатурной навигации)
// ================================================================

export type MenuItem =
  | {
      type: 'item'
      id: string
      label: string
      icon?: ReactNode
      /** Подсказка справа, например горячая клавиша. */
      hint?: string
      tone?: 'default' | 'danger'
      disabled?: boolean
      onSelect?: () => void
      /** Дочерние пункты рендерятся как подменю. */
      children?: MenuItem[]
    }
  | { type: 'separator' }
  | { type: 'label'; label: string }

// ================================================================
//  Публичные пропсы составных частей (Compound Components)
// ================================================================

export interface ContextMenuItemProps {
  /** Явный id пункта; если не задан — генерируется автоматически. */
  id?: string
  label: string
  icon?: ReactNode
  /**
   * Отображаемая горячая клавиша (подсказка справа).
   * Фактический биндинг остаётся на стороне потребителя.
   */
  hotkey?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

export interface ContextMenuSubProps extends ContextMenuItemProps {
  /** Дочерние пункты: <ContextMenu.Item /> / <ContextMenu.Separator /> / <ContextMenu.Header />. */
  children?: ReactNode
}

export interface ContextMenuSeparatorProps {
  id?: string
}

export interface ContextMenuHeaderProps {
  /** Заголовок секции внутри меню. */
  label: string
}

export interface ContextMenuRootProps {
  /** Меню смонтировано и видно. */
  opened: boolean
  /** Точка привязки в координатах вьюпорта (обычно курсор ПКМ). */
  x: number
  y: number
  onClose: () => void
  /** Заголовок над списком пунктов. */
  title?: string
  /**
   * Настройка встроенного действия «Удалить»: когда задана, в конец меню
   * автоматически дописывается разделитель + красный пункт с колбэком наружу.
   */
  onDelete?: () => void
  children: ReactNode
}
