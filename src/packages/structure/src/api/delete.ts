import { invoke } from '@mai/tauri/ipc'

export function sendDeleteNode(nodeId: string): Promise<void> {
  return invoke('delete_node', { nodeId })
}
