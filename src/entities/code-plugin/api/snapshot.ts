import { invoke } from '@tauri-apps/api/core'

export function fetchCodeContent(resourceId: string): Promise<unknown> {
  return invoke<unknown>('code_snapshot', { resourceId })
}
