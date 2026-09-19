import { invoke } from '@mai/tauri/ipc'

/** Отсутствующий ключ — не ошибка: бэкенд возвращает null. */
export function sendKvGet(key: string): Promise<unknown> {
  return invoke<unknown>('kv_get', { key })
}
