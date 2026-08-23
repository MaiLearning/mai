import type { Resource } from '@/entities/resource'

/**
 * Тип ресурса, предоставляемый плагином.
 * Ключ + человекочитаемое имя — достаточно для отображения в UI.
 */
export interface PluginTypeKey {
  key: string
  name: string
}

/**
 * PluginRenderProps — пропсы, передаваемые viewer-компоненту плагина.
 */
export interface PluginRenderProps {
  resourceId: string
  courseId: string
  data?: Resource
  onReady?: () => void
}

/**
 * Пропсы для PluginViewer.
 *
 * Два режима поиска плагина:
 * 1. Явный — указан `pluginId`, рендерится конкретный плагин.
 * 2. Авто-поиск — `pluginId` не указан, ищется плагин по совпадению
 *    `data.typeKey` с `plugin.typeKeys[].key`.
 */
export interface PluginViewerProps {
  pluginId?: string
  resourceId: string
  courseId: string
  data?: Resource
}
