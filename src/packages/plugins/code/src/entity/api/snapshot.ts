import { invoke } from '@mai/tauri/ipc'

export function fetchCodeContent(resourceId: string): Promise<unknown> {
  return invoke<unknown>('code_snapshot', { resourceId })
}
