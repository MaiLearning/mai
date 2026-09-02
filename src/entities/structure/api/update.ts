import { invoke } from '@tauri-apps/api/core'
import { isFakeDataEnabled } from '@/utils/fake-entities-storage'
import { fakeNow, fakeState } from '@/utils/fake-entities-storage/state'

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

export function sendRenameNode(nodeId: string, name: string): Promise<void> {
  if (!isFakeDataEnabled) return invoke('rename_node', { nodeId, name })
  const node = fakeState.nodes.find((item) => item.id === nodeId)
  if (!node) return Promise.resolve()

  const timestamp = fakeNow()
  if (node.isDirectory) {
    const directory = fakeState.directories.find((item) => item.id === node.directoryId)
    if (directory) Object.assign(directory, { name, updatedAt: timestamp })
  } else if (node.resource) {
    const resourceId = node.resource.id
    const resource = fakeState.resources.find((item) => item.id === resourceId)
    if (resource) Object.assign(resource, { name, updatedAt: timestamp })
    node.resource = { ...node.resource, name, updatedAt: timestamp }
  }
  Object.assign(node, { name })

  return Promise.resolve()
}
