import { invoke } from '@tauri-apps/api/core'

export function sendRemovePlugin(id: string): Promise<void> {
  return invoke('remove_plugin', { id })
}
