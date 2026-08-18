import { invoke } from '@tauri-apps/api/core'

export function sendRenameDirectory(nodeId: string, name: string): Promise<void> {
  return invoke('rename_directory', { nodeId, name })
}
