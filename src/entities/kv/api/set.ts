import { invoke } from '@tauri-apps/api/core'
import type { KvEntry } from '../core/model'

export function sendKvSet(key: string, value: unknown): Promise<KvEntry> {
  return invoke<KvEntry>('kv_set', { key, value })
}
