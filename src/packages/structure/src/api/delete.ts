import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendDeleteNode } from './fake'

export function sendDeleteNode(nodeId: string): Promise<void> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendDeleteNode(nodeId)

  return invoke('delete_node', { nodeId })
}
