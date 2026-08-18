import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeState } from '@/utils/fake-entities-storage/state'

export function sendDeleteDirectory(nodeId: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('delete_node', { nodeId })
  fakeState.directories = fakeState.directories.filter((item) => item.id !== nodeId)
  fakeState.nodes = fakeState.nodes.filter((item) => item.id !== nodeId && item.parentId !== nodeId)
  return Promise.resolve()
}
