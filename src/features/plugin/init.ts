import type { ComponentType } from 'react'
import { fetchPlugins } from '@/entities/plugins/services'
import type { ResourceType } from '@/entities/resource'
import { fetchResourceTypes } from '@/entities/resource/services'
import { Plugin } from './core/model'
import type { PluginRenderProps, PluginTypeKey } from './core/types'
import { INTERNAL_VIEWERS } from './registry'
import { pluginStore } from './store'

/**
 * Единая точка загрузки internal-плагинов из backend.
 *
 * Запрашивает плагины и типы ресурсов, для каждого включённого
 * internal-плагина сопоставляет typeKey → компонент из INTERNAL_VIEWERS
 * и регистрирует его в хранилище.
 *
 * Вызывается из runner task initPluginsTask при старте приложения.
 */
export async function loadPlugins(): Promise<void> {
  const [entities, resourceTypes] = await Promise.all([fetchPlugins(), fetchResourceTypes()])

  for (const entity of entities) {
    if (!entity.enabled) continue
    if (entity.kind !== 'internal') continue
    if (pluginStore.has(entity.id)) continue

    const typeKeys = resolveTypeKeys(entity.id, resourceTypes)
    const viewers = pickViewers(typeKeys)

    if (typeKeys.length > 0 && Object.keys(viewers).length === 0) {
      console.warn(
        `[Plugin] No viewers registered for plugin "${entity.id}" (types: ${typeKeys.map((t) => t.key).join(', ')})`,
      )
    }

    const plugin = new Plugin()
    plugin.id = entity.id
    plugin.name = entity.name
    plugin.description = entity.description ?? undefined
    plugin.enabled = entity.enabled
    plugin.typeKeys = typeKeys
    plugin.viewers = viewers

    pluginStore.register(plugin)
  }
}

/**
 * Собирает типы ресурсов, принадлежащие плагину.
 * Экспортировано для юнит-тестов.
 */
export function resolveTypeKeys(pluginId: string, resourceTypes: ResourceType[]): PluginTypeKey[] {
  return resourceTypes
    .filter((t) => t.pluginId === pluginId)
    .map((t) => ({ key: t.key, name: t.name }))
}

function pickViewers(typeKeys: PluginTypeKey[]): Record<string, ComponentType<PluginRenderProps>> {
  const viewers: Record<string, ComponentType<PluginRenderProps>> = {}

  for (const tk of typeKeys) {
    const viewer = INTERNAL_VIEWERS[tk.key]
    if (viewer) viewers[tk.key] = viewer
  }

  return viewers
}
