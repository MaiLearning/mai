import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyResourceChangeAtom, applyResourceTypeChangeAtom } from './sync'

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))

const spies = vi.hoisted(() => ({
  refetchStructureIfLoaded: vi.fn(),
  loadResourceTypes: vi.fn(),
}))

vi.mock('@/entities/structure', () => ({
  refetchStructureIfLoaded: spies.refetchStructureIfLoaded,
}))
vi.mock('./fetch', async () => {
  const { atom } = await import('jotai')

  return { loadResourceTypesAtom: atom(null, spies.loadResourceTypes) }
})

const baseEvent = {
  entity: 'resource',
  action: 'updated',
  id: 'res-1',
  courseId: 'course-1',
  origin: 'http',
  timestamp: 1756800000000,
} as const

describe('applyResourceChangeAtom', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    spies.refetchStructureIfLoaded.mockReset()
    spies.loadResourceTypes.mockReset()
  })

  it('событие с courseId делегирует refetch дерева (helper structure)', async () => {
    await store.set(applyResourceChangeAtom, baseEvent)

    expect(spies.refetchStructureIfLoaded).toHaveBeenCalledTimes(1)
    expect(spies.refetchStructureIfLoaded.mock.calls[0][2]).toBe('course-1')
  })

  it('событие без courseId — helper не вызывается', async () => {
    await store.set(applyResourceChangeAtom, { ...baseEvent, courseId: null })

    expect(spies.refetchStructureIfLoaded).not.toHaveBeenCalled()
  })

  it('ошибка refetch не выпадает наружу, а логируется warn', async () => {
    const { warn } = await import('@tauri-apps/plugin-log')
    spies.refetchStructureIfLoaded.mockRejectedValue(new Error('boom'))

    await store.set(applyResourceChangeAtom, baseEvent)

    expect(warn).toHaveBeenCalledTimes(1)
  })
})

describe('applyResourceTypeChangeAtom', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    spies.loadResourceTypes.mockReset()
  })

  it('событие → глобальный refetch типов (loadResourceTypesAtom)', async () => {
    const event = { ...baseEvent, entity: 'resourceType', id: 'type-1', courseId: null } as const

    await store.set(applyResourceTypeChangeAtom, event)

    expect(spies.loadResourceTypes).toHaveBeenCalledTimes(1)
  })

  it('ошибка refetch не выпадает наружу, а логируется warn', async () => {
    const { warn } = await import('@tauri-apps/plugin-log')
    spies.loadResourceTypes.mockRejectedValue(new Error('boom'))

    await store.set(applyResourceTypeChangeAtom, baseEvent)

    expect(warn).toHaveBeenCalledTimes(1)
  })
})
