import { isFakeDataEnabled } from '@mai/fakeData'
import { invoke } from '@mai/tauri/ipc'
import { fakeSendDeleteDirectory } from './fake'

export function sendDeleteDirectory(nodeId: string): Promise<void> {
  if (import.meta.env.DEV && isFakeDataEnabled()) return fakeSendDeleteDirectory(nodeId)

  return invoke('delete_node', { nodeId })
}
