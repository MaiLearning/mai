import type { ResourceType } from '@mai/resource'
import { fetchResourceTypes } from '@mai/resource'
import { warn } from '@mai/tauri/logs'
import { getDefaultStore } from 'jotai'
import type { ComponentType } from 'react'
import { fetchPlugins } from '../services/fetch'
import { pluginsAtom } from '../store/atoms'
import { pluginStore } from './instance'
import { RuntimePlugin } from './model'
import { getInternalViewer } from './registry'
import type { PluginRenderProps, PluginTypeKey } from './types'

const store = getDefaultStore()

/**
 * Единая точка загрузки internal-плагинов из backend.
 *
 * Запрашивает плагины и типы ресурсов, для каждого включённого
 * internal-плагина сопоставляет typeKey → компонент из реестра viewers
 * и регистрирует его в хранилище.
 *
 * Вызывается из runner task initPluginsTask при старте приложения.
 */
export async function loadPlugins(): Promise<void> {
  const [entities, resourceTypes] = await Promise.all([fetchPlugins(), fetchResourceTypes()])
  store.set(pluginsAtom, entities)

  for (const entity of entities) {
    if (!entity.enabled) continue
    if (entity.kind !== 'internal') continue
    if (pluginStore.has(entity.id)) continue

    const typeKeys = resolveTypeKeys(entity.id, resourceTypes)
    const viewers = pickViewers(typeKeys)

    if (typeKeys.length > 0 && Object.keys(viewers).length === 0) {
      warn(
        `[Plugin] No viewers registered for plugin "${entity.id}" (types: ${typeKeys.map((t) => t.key).join(', ')})`,
      )
    }

    const plugin = new RuntimePlugin()
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
    const viewer = getInternalViewer(tk.key)
    if (viewer) viewers[tk.key] = viewer
  }

  return viewers
}
