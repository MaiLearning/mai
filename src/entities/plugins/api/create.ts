import { invoke } from '@tauri-apps/api/core'
import type { Plugin, RegisterPluginInput } from '../core/model'

export function sendRegisterPlugin(input: RegisterPluginInput): Promise<Plugin> {
  return invoke<Plugin>('register_plugin', { request: input })
}

export function sendRegisterInternalPlugin(input: {
  id: string
  name: string
  version: string
  description?: string | null
  author?: string | null
}): Promise<Plugin> {
  return invoke<Plugin>('register_internal_plugin', { request: input })
}
