import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function sendDeleteNode(nodeId: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('delete_node', { nodeId })
  const node = fakeState.nodes.find((item) => item.id === nodeId)
  fakeState.nodes = fakeState.nodes.filter((item) => item.id !== nodeId && item.parentId !== nodeId)
  if (node?.resource)
    fakeState.resources = fakeState.resources.filter(
      (resource) => resource.id !== node.resource?.id,
    )
  return Promise.resolve()
}
