import { invoke } from '@mai/tauri/ipc'

export function sendDeleteLink(id: string, ownerPluginId: string): Promise<void> {
  return invoke('delete_link', { id, ownerPluginId })
}
