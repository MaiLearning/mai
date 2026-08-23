import type { ComponentType } from 'react'
import type { PluginRenderProps, PluginTypeKey } from './types'

/**
 * Plugin — плагин, зарегистрированный в рантайме приложения.
 *
 * Сейчас поддерживаются только internal-плагины: их viewer-компоненты
 * входят в бандл приложения и рендерятся напрямую (без iframe-sandbox).
 */
export class Plugin {
  /** Уникальный идентификатор плагина (совпадает с id в БД). */
  public id: string = ''

  /** Человекочитаемое имя плагина. */
  public name: string = ''

  /** Описание плагина (опционально). */
  public description?: string

  /** Включён ли плагин. */
  public enabled: boolean = true

  /** Типы ресурсов, которые предоставляет плагин (например "theory"). */
  public typeKeys: PluginTypeKey[] = []

  /** Viewer-компоненты, сгруппированные по typeKey. */
  public viewers: Record<string, ComponentType<PluginRenderProps>> = {}
}
