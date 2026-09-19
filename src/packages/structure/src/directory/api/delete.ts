import { invoke } from '@mai/tauri/ipc'

export function sendDeleteDirectory(nodeId: string): Promise<void> {
  return invoke('delete_node', { nodeId })
}
