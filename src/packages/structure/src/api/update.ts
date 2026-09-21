import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendMoveNode, fakeSendRenameNode } from './fake'

export function sendMoveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  if (import.meta.env.DEV && isFakeDataEnabled())
    return fakeSendMoveNode(nodeId, newParentId, position)

  return invoke('move_node', { nodeId, newParentId, position })
}

export function sendRenameNode(nodeId: string, name: string): Promise<void> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendRenameNode(nodeId, name)

  return invoke('rename_node', { nodeId, name })
}
