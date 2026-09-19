import {
  attachConsole,
  debug,
  error,
  info,
  type LogOptions,
  trace,
  warn,
} from '@tauri-apps/plugin-log'

export type { LogOptions }
export { debug, error, info, trace, warn }

let initialized = false

export async function initLogger(): Promise<() => void> {
  if (initialized) return () => {}
  initialized = true

  const detach = await attachConsole()
  info('[Logger] Инициализирован')

  return detach
}
