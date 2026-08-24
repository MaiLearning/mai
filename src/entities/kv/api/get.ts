import { invoke } from '@tauri-apps/api/core'

/** Отсутствующий ключ — не ошибка: бэкенд возвращает null. */
export function sendKvGet(key: string): Promise<unknown> {
  return invoke<unknown>('kv_get', { key })
}
