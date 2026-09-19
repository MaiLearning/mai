import type { ComponentType } from 'react'
import type { PluginRenderProps } from './types'

/**
 * Реестр viewer-компонентов internal-плагинов.
 *
 * Ключи — typeKey ресурса, значения — React-компоненты для отображения.
 * Используется `loadPlugins()` при загрузке плагинов из backend
 * для сопоставления typeKey → компонент.
 *
 * Для добавления нового вьюера (например TheoryViewer):
 * 1. Создайте компонент, реализующий PluginRenderProps
 * 2. Зарегистрируйте его через `registerInternalViewer(typeKey, viewer)`
 *    на композиционном слое приложения.
 */
const INTERNAL_VIEWERS: Record<string, ComponentType<PluginRenderProps>> = {}

/** Регистрирует viewer для typeKey ресурса (вызывается на композиционном слое приложения). */
export function registerInternalViewer(
  typeKey: string,
  viewer: ComponentType<PluginRenderProps>,
): void {
  INTERNAL_VIEWERS[typeKey] = viewer
}

/** Заменяет реестр целиком (например, при инициализации). */
export function setInternalViewers(
  viewers: Record<string, ComponentType<PluginRenderProps>>,
): void {
  for (const key of Object.keys(INTERNAL_VIEWERS)) delete INTERNAL_VIEWERS[key]
  Object.assign(INTERNAL_VIEWERS, viewers)
}

/** Возвращает viewer по typeKey, если зарегистрирован. */
export function getInternalViewer(typeKey: string): ComponentType<PluginRenderProps> | undefined {
  return INTERNAL_VIEWERS[typeKey]
}
