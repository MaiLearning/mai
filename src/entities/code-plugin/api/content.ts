import { invoke } from '@tauri-apps/api/core'

export function sendUpdateCodeContent(resourceId: string, content: unknown): Promise<unknown> {
  return invoke<unknown>('update_code_content', { resourceId, content })
}
