import { invoke } from '@mai/tauri/ipc'

export function sendMoveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  return invoke('move_node', { nodeId, newParentId, position })
}

export function sendRenameNode(nodeId: string, name: string): Promise<void> {
  return invoke('rename_node', { nodeId, name })
}
