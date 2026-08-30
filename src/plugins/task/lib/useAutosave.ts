import { error as logError } from '@tauri-apps/plugin-log'
import { useCallback, useEffect, useRef, useState } from 'react'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

const SAVE_DEBOUNCE_MS = 800

/**
 * Автосохранение с debounce: расписание ставится заново при каждом изменении,
 * последний снапшот уходит на диск через паузу после последней правки. Ошибка
 * возвращает данные в очередь (повтор при следующем изменении), при уходе
 * с экрана несохранённое летит на диск напрямую. Тихо: статус — наружу, тостов нет.
 */
export function useAutosave<T>(save: (data: T) => Promise<void>) {
  const [state, setState] = useState<AutosaveState>('idle')
  const pendingRef = useRef<T | null>(null)
  const timerRef = useRef<number | null>(null)
  const saveRef = useRef(save)
  saveRef.current = save

  const flush = useCallback(async (data: T) => {
    setState('saving')
    try {
      await saveRef.current(data)
      setState('saved')
    } catch (e) {
      logError(`Автосохранение не удалось: ${e instanceof Error ? e.message : String(e)}`)
      pendingRef.current = data
      setState('error')
    }
  }, [])

  const schedule = useCallback(
    (data: T) => {
      pendingRef.current = data
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null
        const payload = pendingRef.current
        if (payload === null) return
        pendingRef.current = null
        void flush(payload)
      }, SAVE_DEBOUNCE_MS)
    },
    [flush],
  )

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      const pending = pendingRef.current
      if (pending !== null) {
        void saveRef.current(pending).catch((e: unknown) => {
          logError(
            `Финальное автосохранение не удалось: ${e instanceof Error ? e.message : String(e)}`,
          )
        })
      }
    },
    [],
  )

  return { state, schedule }
}
