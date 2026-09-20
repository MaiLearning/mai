import {
  attachConsole,
  type LogOptions,
  debug as tauriDebug,
  error as tauriError,
  info as tauriInfo,
  trace as tauriTrace,
  warn as tauriWarn,
} from '@tauri-apps/plugin-log'

export type { LogOptions }

type Level = 'debug' | 'info' | 'warn' | 'error' | 'trace'

/** Плагин доступен только внутри Tauri-окружения: в чистом браузере (Storybook) его нет. */
function isTauriRuntime(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__)
  )
}

function toConsole(level: Level, message: string): void {
  console[level](message)
}

function wrap<F extends (message: string, options?: LogOptions) => void>(
  level: Level,
  viaTauri: F,
): F {
  return ((message: string, options?: LogOptions) => {
    if (isTauriRuntime()) return viaTauri(message, options)

    toConsole(level, message)
  }) as F
}

export const debug = wrap('debug', tauriDebug)
export const error = wrap('error', tauriError)
export const info = wrap('info', tauriInfo)
export const trace = wrap('trace', tauriTrace)
export const warn = wrap('warn', tauriWarn)

let initialized = false

export async function initLogger(): Promise<() => void> {
  if (initialized) return () => {}
  initialized = true

  const detach = await attachConsole()
  info('[Logger] Инициализирован')

  return detach
}
