import { invoke } from '@tauri-apps/api/core'

export function sendRunCode(language: unknown, code: string): Promise<unknown> {
  return invoke<unknown>('code_run', { language, code })
}
