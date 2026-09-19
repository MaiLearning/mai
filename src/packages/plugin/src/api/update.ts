import { invoke } from '@mai/tauri/ipc'
import type { Plugin } from '../core/model'

export function sendSetPluginEnabled(id: string, enabled: boolean): Promise<Plugin> {
  return invoke<Plugin>('set_plugin_enabled', { id, request: { enabled } })
}
