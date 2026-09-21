/** Плагин доступен только внутри Tauri-окружения: в чистом браузере (Storybook) его нет. */
export function isTauriRuntime(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean((window as unknown as { __TAURI_INTERNALS__?: unknown }).__TAURI_INTERNALS__)
  )
}
