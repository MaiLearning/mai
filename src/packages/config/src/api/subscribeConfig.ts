import { listen } from '@tauri-apps/api/event'

/** Событие изменения mai.toml: payload — новый конфиг как JSON. */
export const CONFIG_CHANGED_EVENT = 'config://changed'

/**
 * Подписка на изменения конфига. Возвращает функцию отписки —
 * но в приложении подписка живёт всё время жизни (один раз на старте).
 */
export function subscribeConfigChanged(onChange: (config: unknown) => void): Promise<() => void> {
  return listen<unknown>(CONFIG_CHANGED_EVENT, (event) => {
    onChange(event.payload)
  })
}
