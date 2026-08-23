import type { ReactNode } from 'react'

/**
 * Узел структуры курса.
 * `folder` — группа, может содержать других детей.
 * `resource` — единица обучения (урок / материал / задание).
 */
export type CourseNodeType = 'folder' | 'resource'

export interface CourseNode {
  id: string
  type: CourseNodeType
  title: string
  /** Только для folder. Пустой массив — валидная пустая папка. */
  children?: CourseNode[]
  /** Опциональная короткая метка справа: «12 мин», «Черновик» и т.п. */
  badge?: string
  /** Визуальный тон метки. */
  badgeTone?: 'neutral' | 'accent' | 'success' | 'danger' | 'info'
}

/** Описание действия в панели действий. Список открыт на расширение. */
export interface SidebarAction {
  id: string
  label: string
  icon?: ReactNode
  /** `primary` — заливка brand, `ghost` — прозрачная. */
  variant?: 'primary' | 'ghost'
  disabled?: boolean
  onSelect: () => void
}
