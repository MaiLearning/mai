import { invoke } from '@tauri-apps/api/core'

export function sendDeleteNode(nodeId: string): Promise<void> {
  return invoke('delete_node', { nodeId })
}
