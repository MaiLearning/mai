import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSavePipeline, HOLD_MS, type SaveState } from './save-pipeline'

function deferred() {
  let resolve!: () => void
  let reject!: (e: unknown) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

function collector() {
  const states: SaveState[] = []

  return { states, listener: (s: SaveState) => states.push(s) }
}

describe('save pipeline', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('первая операция уходит немедленно и ставит saving; успех + удержание → saved', async () => {
    const { states, listener } = collector()
    const gate = deferred()
    const pipeline = createSavePipeline()
    pipeline.subscribe(listener)

    pipeline.enqueue({ run: () => gate.promise })
    expect(states).toEqual(['saving'])

    gate.resolve()
    await vi.advanceTimersByTimeAsync(0)
    expect(states).toEqual(['saving'])

    await vi.advanceTimersByTimeAsync(HOLD_MS)
    expect(states).toEqual(['saving', 'saved'])
  })

  it('операции с одним coalesceKey коалесцируются — в очереди остаётся последняя', async () => {
    const gate = deferred()
    const run1 = vi.fn(() => gate.promise)
    const run2 = vi.fn(() => Promise.resolve())
    const run3 = vi.fn(() => Promise.resolve())
    const pipeline = createSavePipeline()

    pipeline.enqueue({ coalesceKey: 'content:t1', run: run1 })
    pipeline.enqueue({ coalesceKey: 'content:t1', run: run2 })
    pipeline.enqueue({ coalesceKey: 'content:t1', run: run3 })

    expect(run1).toHaveBeenCalledTimes(1)
    gate.resolve()
    await vi.advanceTimersByTimeAsync(0)

    expect(run2).not.toHaveBeenCalled()
    expect(run3).toHaveBeenCalledTimes(1)
  })

  it('ошибка → error немедленно, очередь сбрасывается; следующая мутация восстанавливает', async () => {
    const { states, listener } = collector()
    const failing = deferred()
    const pipeline = createSavePipeline()
    pipeline.subscribe(listener)
    const queuedRun = vi.fn(() => Promise.resolve())

    pipeline.enqueue({ run: () => failing.promise })
    pipeline.enqueue({ run: queuedRun })

    failing.reject(new Error('ipc down'))
    await vi.advanceTimersByTimeAsync(0)

    expect(states).toEqual(['saving', 'error'])
    expect(queuedRun).not.toHaveBeenCalled()

    pipeline.enqueue({ run: () => Promise.resolve() })
    await vi.advanceTimersByTimeAsync(0)
    expect(states).toEqual(['saving', 'error', 'saving'])
  })

  it('удержание истекло при полёте — оптимистичное saved; поздняя ошибка корректирует', async () => {
    const { states, listener } = collector()
    const gate = deferred()
    const pipeline = createSavePipeline()
    pipeline.subscribe(listener)

    pipeline.enqueue({ run: () => gate.promise })
    await vi.advanceTimersByTimeAsync(HOLD_MS)
    expect(states).toEqual(['saving', 'saved'])

    gate.reject(new Error('late failure'))
    await vi.advanceTimersByTimeAsync(0)
    expect(states).toEqual(['saving', 'saved', 'error'])
  })

  it('поздний успех после оптимистичного saved не возвращает saving', async () => {
    const { states, listener } = collector()
    const gate = deferred()
    const pipeline = createSavePipeline()
    pipeline.subscribe(listener)

    pipeline.enqueue({ run: () => gate.promise })
    await vi.advanceTimersByTimeAsync(HOLD_MS)
    gate.resolve()
    await vi.advanceTimersByTimeAsync(0)

    expect(states).toEqual(['saving', 'saved'])
  })

  it('flushPending отправляет накопленное fire-and-forget и логирует неудачу', async () => {
    const logError = vi.fn()
    const gate = deferred()
    const pipeline = createSavePipeline(logError)
    const queued = deferred()

    pipeline.enqueue({ run: () => gate.promise })
    pipeline.enqueue({ run: () => queued.promise })
    pipeline.flushPending()

    expect(vi.getTimerCount()).toBe(0)
    gate.resolve()
    queued.reject(new Error('flush failed'))
    await vi.advanceTimersByTimeAsync(0)

    expect(logError).toHaveBeenCalledWith('Финальное сохранение не удалось: flush failed')
  })
})
