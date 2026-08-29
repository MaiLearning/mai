import type { ComponentType } from 'react'
import { TaskViewer, TheoryViewer } from '@/plugins'
import type { PluginRenderProps } from './core/types'

/**
 * Реестр viewer-компонентов internal-плагинов.
 *
 * Ключи — typeKey ресурса, значения — React-компоненты для отображения.
 * Используется `loadPlugins()` при загрузке плагинов из backend
 * для сопоставления typeKey → компонент.
 *
 * Для добавления нового вьюера (например TheoryViewer):
 * 1. Создайте компонент, реализующий PluginRenderProps
 * 2. Импортируйте его сюда
 * 3. Добавьте запись в INTERNAL_VIEWERS
 */
export const INTERNAL_VIEWERS: Record<string, ComponentType<PluginRenderProps>> = {
  theory: TheoryViewer,
  task: TaskViewer,
}
