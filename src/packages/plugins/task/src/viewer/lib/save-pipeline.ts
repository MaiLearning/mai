/**
 * Конвейер сохранения задач — ядро без React (хук-обёртка в useSavePipeline).
 *
 * Дисциплина: одна in-flight операция на ресурс, отправка немедленно при
 * простое, однотипные операции коалесцируются (в очереди остаётся последняя).
 * Задержка отправки — чисто UX-удержание индикатора: реальной дебаунс-паузы
 * нет, каждая мутация либо уходит сразу, либо ждёт завершения текущей.
 * Все операции full-replace: упавшая выкидывается, следующая мутация
 * пере-отправит актуальное состояние (само-восстановление).
 */

/** Статус сохранения для индикатора в футере воркспейса. */
export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export type SaveOp = {
  /** Операции с одним ключом коалесцируют: в очереди остаётся последняя. */
  coalesceKey?: string
  run: () => Promise<void>
}

/** Сколько индикатор держит «Сохранение…» после последней мутации (мс). */
export const HOLD_MS = 800

type Timer = ReturnType<typeof setTimeout>

export interface SavePipeline {
  enqueue: (op: SaveOp) => void
  subscribe: (listener: (state: SaveState) => void) => () => void
  /** Флаш накопленных операций fire-and-forget (при размонтировании). */
  flushPending: () => void
}

const formatError = (e: unknown) => (e instanceof Error ? e.message : String(e))

export function createSavePipeline(logError: (message: string) => void = () => {}): SavePipeline {
  let queue: SaveOp[] = []
  let inFlight = false
  let state: SaveState = 'idle'
  let holdTimer: Timer | null = null
  const listeners = new Set<(state: SaveState) => void>()

  const setState = (next: SaveState) => {
    state = next
    for (const listener of listeners) listener(next)
  }

  const clearHold = () => {
    if (holdTimer !== null) {
      clearTimeout(holdTimer)
      holdTimer = null
    }
  }

  /** Новая мутация: показываем «Сохранение…» и перезапускаем удержание. */
  const restartHold = () => {
    clearHold()
    if (state !== 'saving') setState('saving')
    holdTimer = setTimeout(() => {
      holdTimer = null
      // Оптимистично: удержание истекло — «Сохранено», даже если ответ ещё в полёте.
      if (state === 'saving') setState('saved')
    }, HOLD_MS)
  }

  const runNext = () => {
    const op = queue.shift()
    if (!op) {
      inFlight = false
      // Очередь пуста и удержание истекло — поздний успех, остаёмся «Сохранено».
      if (state === 'saving' && holdTimer === null) setState('saved')

      return
    }
    if (state === 'saved' && holdTimer === null) setState('saving')
    inFlight = true
    op.run().then(
      () => runNext(),
      (e: unknown) => {
        clearHold()
        inFlight = false
        queue = []
        logError(`Сохранение не удалось: ${formatError(e)}`)
        setState('error')
      },
    )
  }

  return {
    enqueue(op) {
      if (op.coalesceKey) {
        const existing = queue.findIndex((queued) => queued.coalesceKey === op.coalesceKey)
        if (existing >= 0) queue[existing] = op
        else queue.push(op)
      } else {
        queue.push(op)
      }
      restartHold()
      if (!inFlight) runNext()
    },

    subscribe(listener) {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },

    flushPending() {
      clearHold()
      const pending = queue
      queue = []
      for (const op of pending) {
        op.run().catch((e: unknown) => {
          logError(`Финальное сохранение не удалось: ${formatError(e)}`)
        })
      }
    },
  }
}
