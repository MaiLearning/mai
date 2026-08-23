import { getDefaultStore } from 'jotai'
import type { Plugin } from '../core/model'
import { runtimePluginsAtom } from './atoms'

const store = getDefaultStore()

/**
 * Хранилище зарегистрированных плагинов.
 * Обертка поверх Jotai-стора: мутации доступны вне React, подписка — через атом.
 */
export class PluginStore {
  register(plugin: Plugin): void {
    const prev = store.get(runtimePluginsAtom)

    if (prev.some((p) => p.id === plugin.id)) {
      console.warn(`[PluginStore] Plugin "${plugin.id}" is already registered`)
      return
    }

    store.set(runtimePluginsAtom, [...prev, plugin])
  }

  unregister(id: string): boolean {
    const prev = store.get(runtimePluginsAtom)

    if (!prev.some((p) => p.id === id)) return false

    store.set(
      runtimePluginsAtom,
      prev.filter((p) => p.id !== id),
    )
    return true
  }

  get(id: string): Plugin | undefined {
    return store.get(runtimePluginsAtom).find((p) => p.id === id)
  }

  getAll(): Plugin[] {
    return [...store.get(runtimePluginsAtom)]
  }

  has(id: string): boolean {
    return store.get(runtimePluginsAtom).some((p) => p.id === id)
  }

  enable(id: string): void {
    this.setEnabled(id, true)
  }

  disable(id: string): void {
    this.setEnabled(id, false)
  }

  clear(): void {
    store.set(runtimePluginsAtom, [])
  }

  find(predicate: (plugin: Plugin) => boolean): Plugin[] {
    return store.get(runtimePluginsAtom).filter(predicate)
  }

  get count(): number {
    return store.get(runtimePluginsAtom).length
  }

  private setEnabled(id: string, enabled: boolean): void {
    const plugins = store.get(runtimePluginsAtom)
    const plugin = plugins.find((p) => p.id === id)

    if (!plugin) return

    plugin.enabled = enabled
    store.set(runtimePluginsAtom, [...plugins])
  }
}
