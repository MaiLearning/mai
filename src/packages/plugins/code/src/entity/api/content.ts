import { invoke } from '@mai/tauri/ipc'

export function sendUpdateCodeContent(resourceId: string, content: unknown): Promise<unknown> {
  return invoke<unknown>('update_code_content', { resourceId, content })
}
