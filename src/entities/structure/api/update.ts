import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function sendMoveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  if (!isFakeDataEnabled) return invoke('move_node', { nodeId, newParentId, position })
  const node = fakeState.nodes.find((item) => item.id === nodeId)
  if (node) Object.assign(node, { parentId: newParentId, position })
  return Promise.resolve()
}
