import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { applyPluginChangeAtom } from './sync'

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))

const spies = vi.hoisted(() => ({
  loadPlugins: vi.fn(),
}))

vi.mock('./fetch', async () => {
  const { atom } = await import('jotai')

  return { loadPluginsAtom: atom(null, spies.loadPlugins) }
})

const httpEvent = {
  entity: 'plugin',
  action: 'updated',
  id: 'plugin-a',
  courseId: null,
  origin: 'http',
  timestamp: 1756800000000,
} as const

describe('applyPluginChangeAtom', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    spies.loadPlugins.mockReset()
  })

  it('событие → глобальный refetch плагинов (loadPluginsAtom)', async () => {
    await store.set(applyPluginChangeAtom, httpEvent)

    expect(spies.loadPlugins).toHaveBeenCalledTimes(1)
  })

  it('ошибка refetch не выпадает наружу, а логируется warn', async () => {
    const { warn } = await import('@tauri-apps/plugin-log')
    spies.loadPlugins.mockRejectedValue(new Error('boom'))

    await store.set(applyPluginChangeAtom, httpEvent)

    expect(warn).toHaveBeenCalledTimes(1)
  })
})
