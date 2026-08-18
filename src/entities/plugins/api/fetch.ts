import { invoke } from '@tauri-apps/api/core'
import type { Plugin } from '../core/model'

export function fetchPlugins(): Promise<Plugin[]> {
  return invoke<Plugin[]>('list_plugins')
}

export function fetchPluginById(id: string): Promise<Plugin> {
  return invoke<Plugin>('get_plugin', { id })
}

export function fetchPluginCode(id: string): Promise<string> {
  return invoke<string>('get_plugin_code', { id })
}

export function fetchPluginManifest(id: string): Promise<string> {
  return invoke<string>('get_plugin_manifest', { id })
}
