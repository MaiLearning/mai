import { invoke } from '@mai/tauri/ipc'

/** Текущий конфиг проекта (JSON из mai.toml) — внутренняя команда бэкенда. */
export function sendConfigGet(): Promise<unknown> {
  return invoke<unknown>('config_get')
}
