import { beforeEach, describe, expect, it } from 'vitest'
import { createBus } from './bus'

const resourceEvent = {
  entity: 'resource',
  action: 'updated',
  id: 'res-1',
  courseId: 'course-1',
  origin: 'http',
  timestamp: 1756800000000,
} as const

describe('bus', () => {
  let emitter: ReturnType<typeof createBus>

  beforeEach(() => {
    emitter = createBus()
  })

  it('подписчик получает emit с аргументами', () => {
    const received: unknown[] = []
    emitter.on('resource/changed', (event) => {
      received.push(event)
    })

    emitter.emit('resource/changed', { ...resourceEvent })

    expect(received).toHaveLength(1)
    expect(received[0]).toEqual(resourceEvent)
  })

  it('off() отписывает: повторный emit не доходит', () => {
    let calls = 0
    const off = emitter.on('resource/changed', () => {
      calls += 1
    })

    emitter.emit('resource/changed', { ...resourceEvent })
    off()
    emitter.emit('resource/changed', { ...resourceEvent })

    expect(calls).toBe(1)
  })

  it('два подписчика на одно событие получают оба', () => {
    let first = 0
    let second = 0
    emitter.on('resource/changed', () => {
      first += 1
    })
    emitter.on('resource/changed', () => {
      second += 1
    })

    emitter.emit('resource/changed', { ...resourceEvent })

    expect(first).toBe(1)
    expect(second).toBe(1)
  })
})
