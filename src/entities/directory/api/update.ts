import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeNow, fakeState } from '@/utils/fake-entities-storage/state'

export function sendRenameDirectory(nodeId: string, name: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('rename_directory', { nodeId, name })
  const directory = fakeState.directories.find((item) => item.id === nodeId)
  const node = fakeState.nodes.find((item) => item.id === nodeId)
  if (directory) Object.assign(directory, { name, updatedAt: fakeNow() })
  if (node) Object.assign(node, { name })
  return Promise.resolve()
}
