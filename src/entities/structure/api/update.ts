import { invoke } from '@tauri-apps/api/core'

export function sendMoveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  return invoke('move_node', { nodeId, newParentId, position })
}
