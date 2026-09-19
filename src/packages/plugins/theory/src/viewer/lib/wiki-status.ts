import { useSyncExternalStore } from 'react'

/** Статус wiki-целей resourceId → 'ok' | 'broken' (вычисляется backend-ом при чтении рёбер). */
export type WikiStatusMap = Record<string, 'ok' | 'broken'>

let statuses: WikiStatusMap = {}
const listeners = new Set<() => void>()

/** Заменяет карту статусов и уведомляет подписчиков (node-вью wiki-ссылок). */
export function setWikiStatuses(next: WikiStatusMap): void {
  statuses = next
  listeners.forEach((notify) => notify())
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)

  return () => listeners.delete(listener)
}

/** Реактивный статус цели wiki-ссылки: broken → приглушённый рендер. */
export function useWikiStatus(resourceId: string): 'ok' | 'broken' | null {
  return useSyncExternalStore(
    subscribe,
    () => statuses[resourceId] ?? null,
    () => null,
  )
}
