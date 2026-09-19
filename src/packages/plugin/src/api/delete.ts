import { invoke } from '@mai/tauri/ipc'

export function sendRemovePlugin(id: string): Promise<void> {
  return invoke('remove_plugin', { id })
}
