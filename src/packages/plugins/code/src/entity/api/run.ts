import { invoke } from '@mai/tauri/ipc'

export function sendRunCode(language: unknown, code: string): Promise<unknown> {
  return invoke<unknown>('code_run', { language, code })
}
